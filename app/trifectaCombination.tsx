import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, TextInput } from "react-native";
import { Buffer } from "buffer";


export default function TrifectBox() {
  const [horses, setHorses] = useState([]); // 馬データ用
  const [selectedHorses, setSelectedHorses] = useState<number[]>([]);
  const route = useRoute();
  const [payout, setPayout] = useState(0); // 払い戻し
  const { year, dayCount, place, race, round } = route.params || {};
  const [betAmounts, setBetAmounts] = useState<{ [key: string]: string }>({});

  
  useEffect(() => {
    const fetchHorses = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/get_horses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year, dayCount, place, race, round }),
        });
        const data = await response.json();
        if (data.success) {
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
    fetchHorses();
  }, [year, dayCount, place, race, round]);

  const toggleHorse = (horse: number) => {
    setSelectedHorses((prev) =>
      prev.includes(horse) ? prev.filter((h) => h !== horse) : [...prev, horse]
    );
  };


  const generateTrifectaBox = (horseNumbers: number[]) => {
    const results: number[][] = [];

    // 組合せ生成
    const getCombinations = (arr: number[], k: number): number[][] => {
      const res: number[][] = [];
      const helper = (start: number, combo: number[]) => {
        if (combo.length === k) {
          res.push([...combo]);
          return;
        }
        for (let i = start; i < arr.length; i++) {
          helper(i + 1, [...combo, arr[i]]);
        }
      };
      helper(0, []);
      return res;
    };

    // 順列生成
    const getPermutations = (arr: number[]): number[][] => {
      const res: number[][] = [];
      const permute = (temp: number[], remaining: number[]) => {
        if (remaining.length === 0) {
          res.push(temp);
          return;
        }
        for (let i = 0; i < remaining.length; i++) {
          const next = remaining.slice();
          const current = next.splice(i, 1);
          permute(temp.concat(current), next);
        }
      };
      permute([], arr);
      return res;
    };

    // 組合せごとに順列を作成
    const combinations = getCombinations(horseNumbers, 3);
    combinations.forEach((combo) => {
      const perms = getPermutations(combo);
      results.push(...perms);
    });

    return results;
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
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("ログインしてください。");
        return;
      }
      const userId = getUserIdFromToken(token);
      if (!userId) {
        alert("ユーザー認証に問題があります。");
        return;
      }

      const formattedPayload = {
        userId,
        year,
        name: "三連単",
        dayCount: formatToTwoDigits(dayCount),
        place: formatToTwoDigits(place),
        race: formatToTwoDigits(race),
        round: formatToTwoDigits(round),
        combinations: generateTrifectaBox(selectedHorses),
        amounts: generateTrifectaBox(selectedHorses).map(
          (combo) => Number(betAmounts[combo.join(",")] || 0)
        ), 
      };

      console.log("Payload being sent:", formattedPayload);

      const response = await fetch("http://127.0.0.1:5000/api/check_payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
  const handleBetAmountChange = (combinationKey: string, value: string) => {
    setBetAmounts((prev) => ({
      ...prev,
      [combinationKey]: value,
    }));
  };
  const combinations = generateTrifectaBox(selectedHorses);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>三連単ボックス</Text>

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
            <View style={styles.rowCol}>
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
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  horseItem: {
    flex: 1,
    margin: 4,
    padding: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    borderRadius: 4,
  },
  rowCol: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  column: {
    fontSize: 16,
    flex: 2, // 買い目の幅
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    borderRadius: 4,
    width: 100, // 入力欄の幅
    textAlign: "center",
  },
  selectedHorse: {
    backgroundColor: "#00adf5"
  },
  horseText: {
    fontSize: 16

  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16
  },
  combination: {
    fontSize: 16,
    marginVertical: 2
  },
  result: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16
  },
});
