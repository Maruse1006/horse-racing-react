import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, TextInput } from "react-native";

export default function TrioBoxScreen() {
  const [horses, setHorses] = useState([]); // 馬データ用のステート
  const [selectedHorses, setSelectedHorses] = useState<number[]>([]);
  const route = useRoute();
  const { dayCount, place, race, round } = route.params || {};
  const [payout, setPayout] = useState(0); // 払い戻し金額
  const [betAmounts, setBetAmounts] = useState<{ [key: string]: string }>({});



  useEffect(() => {
    // 馬データをバックエンドから取得
    const fetchHorses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/get_horses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dayCount, place, race, round }),
        });
        const data = await response.json();
        if (data.success) {
          // 馬データを番号順にソートして保存
          const sortedHorses = data.horses.sort((a, b) => parseInt(a.number) - parseInt(b.number));
          setHorses(sortedHorses); // ソート済みの馬データを保存
        } else {
          alert("馬データの取得に失敗しました。");
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
        alert("バックエンドへのリクエストに失敗しました。");
      }
    };

    console.log("Received parameters:", { dayCount, place, race, round });
    fetchHorses(); // データを取得する関数を呼び出し
  }, [dayCount, place, race, round]);


  const toggleHorse = (horse: number) => {
    setSelectedHorses((prev) =>
      prev.includes(horse)
        ? prev.filter((h) => h !== horse)
        : [...prev, horse]
    );
  };

  const handleBetAmountChange = (combinationKey: string, value: string) => {
    setBetAmounts((prev) => ({
      ...prev,
      [combinationKey]: value,
    }));
  };


  const generateCombinations = (horseNumbers: number[]) => {
    const combinations: number[][] = [];
    for (let i = 0; i < horseNumbers.length; i++) {
      for (let j = i + 1; j < horseNumbers.length; j++) {
        combinations.push([horseNumbers[i], horseNumbers[j]]);
      }
    }
    return combinations;
  };

  const formatToTwoDigits = (value) => {
    if (typeof value === "string" && !isNaN(value)) {
      return value.padStart(2, "0");
    }
    if (typeof value === "number") {
      return value.toString().padStart(2, "0");
    }
    return value;
  };


  const getUserIdFromToken = (token) => {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.sub; 
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };


  const combinationsWithBetAmounts = generateCombinations(
    selectedHorses
  ).map((combination) => {
    const combinationKey = combination.join(",");
    const betAmount = betAmounts[combinationKey] || "0";

    // ログ: 各組み合わせと賭け額
    console.log("組み合わせ:", combination, "→ キー:", combinationKey, "→ 賭け額:", betAmount);

    return {
      combination,
      betAmount,
    };
  });


  const checkPayout = async () => {
    try {
      // トークンからユーザーIDを取得
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        alert('ログインしてください。');
        return;
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        alert('ユーザー認証に問題があります。');
        return;
      }

      const formattedPayload = {
        userId,
        name: "ワイド",
        dayCount: formatToTwoDigits(dayCount),
        place: formatToTwoDigits(place),
        race: formatToTwoDigits(race),
        round: formatToTwoDigits(round),
        combinations: combinationsWithBetAmounts,

      };

      console.log("Payload being sent:", formattedPayload);

      const response = await fetch("http://127.0.0.1:5000/api/check_payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedPayload),
      });

      const data = await response.json();

      if (data.success) {
        setPayout(data.payout);
      } else {
        setPayout(0);
        alert("該当する払い戻しがありません。");
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
      alert("バックエンドへのリクエストに失敗しました。");
    }
  };




  const combinations = generateCombinations(selectedHorses);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>馬連ボックス</Text>

      {/* 馬番号を表示 */}
      <FlatList
        data={horses}
        numColumns={4}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.horseItem,
              selectedHorses.includes(item.number) && styles.selectedHorse,
            ]}
            onPress={() => toggleHorse(item.number)}
          >
            <Text style={styles.horseText}>{item.name} ({item.number})</Text>
          </TouchableOpacity>
        )}
      />

      {/* 組み合わせを表示 */}
      <Text style={styles.resultTitle}>組み合わせ数: {combinations.length}</Text>
      <FlatList
        data={combinations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.combination}>{item.join(", ")}</Text>
        )}
      />
      <FlatList
        data={combinations}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          const combinationKey = item.join(",");
          return (
            <View style={styles.row}>
              <Text style={styles.column}>{`買い目: ${item.join(" - ")}`}</Text>
              <TextInput
                style={[styles.column, styles.input]}
                keyboardType="numeric"
                placeholder="賭け額"
                value={betAmounts[combinationKey] || ""}
                onChangeText={(value) =>
                  handleBetAmountChange(combinationKey, value)
                }
              />
            </View>
          );
        }}
      />
      <Button title="払い戻し金額を確認" onPress={checkPayout} />
      <Text style={styles.result}>
        払い戻し金額: {payout > 0 ? `¥${payout}` : "該当なし"}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  horseItem: {
    flex: 1,
    margin: 4,
    padding: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    borderRadius: 4,
  },
  selectedHorse: {
    backgroundColor: "#00adf5",
  },
  horseText: {
    fontSize: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  combination: {
    fontSize: 16,
    marginVertical: 2,
  },
  result: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8
  }

});
