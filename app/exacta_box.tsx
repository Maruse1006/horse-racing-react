import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, TextInput } from "react-native";
import { Buffer } from "buffer";

export default function ExactaBox() {
  const [horses, setHorses] = useState([]); // 馬データ用のステート
  const [selectedHorses, setSelectedHorses] = useState<number[]>([]);
  const route = useRoute();
  const { year, dayCount, place, race, round } = route.params || {};
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
          body: JSON.stringify({ year, dayCount, place, race, round }),
        });
        const data = await response.json();

        if (data.success) {
          // 馬データを番号順にソートして保存
          const sortedHorses = data.horses.sort((a, b) => parseInt(a.number) - parseInt(b.number));
          setHorses(sortedHorses);
        } else {
          alert("馬データの取得に失敗しました。");
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
        alert("バックエンドへのリクエストに失敗しました。");
      }
    };

    console.log("Received parameters:", { year, dayCount, place, race, round });
    fetchHorses();
  }, [year, dayCount, place, race, round]);

  const handleBetAmountChange = (combinationKey: string, value: string) => {
    setBetAmounts((prev) => ({
      ...prev,
      [combinationKey]: value,
    }));
  };

  const toggleHorse = (horse: number) => {
    setSelectedHorses((prev) =>
      prev.includes(horse) ? prev.filter((h) => h !== horse) : [...prev, horse]
    );
  };

  // 馬単ボックス用: 選んだ馬から順序ありの全組み合わせを生成
  const generateCombinations = (horseNumbers: number[]) => {
    const combinations: number[][] = [];
    for (let i = 0; i < horseNumbers.length; i++) {
      for (let j = 0; j < horseNumbers.length; j++) {
        if (i !== j) {
          combinations.push([horseNumbers[i], horseNumbers[j]]);
        }
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

  const getUserIdFromToken = (token: string) => {
    try {
      const payload = token.split(".")[1];
      const decodedJson = Buffer.from(payload, "base64").toString("utf-8");
      const decoded = JSON.parse(decodedJson);
      console.log("JWT Payload:", decoded); // デバッグ用
      const userId = parseInt(decoded.sub, 10);
      return userId;
    } catch (e) {
      console.error("JWTデコードエラー", e);
      return null;
    }
  };

  const checkPayout = async () => {
    try {
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

      // 賭け額が0以外の組み合わせだけを抽出
      const combinationsWithBetAmounts = generateCombinations(selectedHorses)
        .map((combination) => {
          const combinationKey = combination.join(",");
          const betAmount = betAmounts[combinationKey] || "0";
          return { combination, betAmount };
        })
        .filter((item) => parseInt(item.betAmount, 10) > 0); // 0円の組み合わせを除外

      const formattedPayload = {
        userId,
        name: "馬単",
        year:year,
        dayCount: formatToTwoDigits(dayCount),
        place: formatToTwoDigits(place),
        race: formatToTwoDigits(race),
        round: formatToTwoDigits(round),
        combinations: combinationsWithBetAmounts.map(item => item.combination),
        amounts: combinationsWithBetAmounts.map(item => item.betAmount),
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
      <Text style={styles.title}>馬単ボックス</Text>

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

      <Text style={styles.resultTitle}>組み合わせ数: {combinations.length}</Text>
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
  result: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  column: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: "right",
    fontSize: 16,
  },
});
