import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, TextInput, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";

export default function TrioSecondKeyScreen() {
  const [horses, setHorses] = useState([]); // 馬データ用
  const [firstRow, setFirstRow] = useState([]); // 2着候補
  const [secondRow, setSecondRow] = useState([]); // 1・3着候補
  const [payout, setPayout] = useState(0); // 払い戻し金額
  const [betAmounts, setBetAmounts] = useState<{ [key: string]: string }>({}); // 賭け額

  const navigation = useNavigation();
  const route = useRoute();
  const { year, dayCount, place, race, round } = route.params || {};

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

  const toggleSelection = (rowSetter, row, horse, isSingleSelection = false) => {
    rowSetter((prev) =>
      prev.includes(horse)
        ? prev.filter((h) => h !== horse)
        : isSingleSelection
        ? [horse]
        : [...prev, horse]
    );
  };

  const selectAll = (rowSetter) => {
    rowSetter(horses.map((horse) => horse.number));
  };

  const clearSelection = (rowSetter) => {
    rowSetter([]);
  };

  const calculateCombinations = () => {
    const combinations = [];
    for (let fixedSecond of firstRow) { // 2着を固定
      for (let i = 0; i < secondRow.length; i++) {
        for (let j = 0; j < secondRow.length; j++) {
          if (i !== j) {
            const first = secondRow[i];
            const third = secondRow[j];
            if (fixedSecond !== first && fixedSecond !== third) {
              combinations.push([first, fixedSecond, third]); // 組み合わせ
            }
          }
        }
      }
    }
    return combinations;
  };

  const formatToTwoDigits = (value) => {
    if (typeof value === "string" && !isNaN(value)) return value.padStart(2, "0");
    if (typeof value === "number") return value.toString().padStart(2, "0");
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

  const handleBetAmountChange = (combinationKey: string, value: string) => {
    setBetAmounts((prev) => ({
      ...prev,
      [combinationKey]: value,
    }));
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

      const combinations = calculateCombinations();

      const formattedPayload = {
        userId,
        year,
        name: "三連単",
        dayCount: formatToTwoDigits(dayCount),
        place: formatToTwoDigits(place),
        race: formatToTwoDigits(race),
        round: formatToTwoDigits(round),
        combinations: combinations,
        amounts: combinations.map(
          (combo) => Number(betAmounts[combo.join(",")] || 0)
        ), // 金額配列で送信
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

  const combinations = calculateCombinations();

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>三連単2着流し</Text>

        {/* 2着候補 */}
        <View style={styles.row}>
          <Text style={styles.label}>2着</Text>
          <FlatList
            data={horses}
            numColumns={4}
            keyExtractor={(item) => item.number.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.horseItem,
                  firstRow.includes(item.number) && styles.selectedHorse,
                ]}
                onPress={() => toggleSelection(setFirstRow, firstRow, item.number, true)}
              >
                <Text style={styles.horseText}>{item.number}. {item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonRow}>
            <Button title="クリア" onPress={() => clearSelection(setFirstRow)} />
          </View>
        </View>

        {/* 1・3着候補 */}
        <View style={styles.row}>
          <Text style={styles.label}>1・3着</Text>
          <FlatList
            data={horses}
            numColumns={4}
            keyExtractor={(item) => item.number.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.horseItem,
                  secondRow.includes(item.number) && styles.selectedHorse,
                ]}
                onPress={() => toggleSelection(setSecondRow, secondRow, item.number)}
              >
                <Text style={styles.horseText}>{item.number}. {item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonRow}>
            <Button title="全通り" onPress={() => selectAll(setSecondRow)} />
            <Button title="クリア" onPress={() => clearSelection(setSecondRow)} />
          </View>
        </View>

        {/* 組み合わせと賭け額 */}
        <Text style={styles.result}>総組み合わせ数: {combinations.length}</Text>
        <FlatList
          data={combinations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const combinationKey = item.join(",");
            return (
              <View style={styles.rowCol}>
                <Text style={styles.column}>{`買い目: ${item.join(" - ")}`}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="賭け額"
                  value={betAmounts[combinationKey] || ""}
                  onChangeText={(value) => handleBetAmountChange(combinationKey, value)}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  row: { marginBottom: 16 },
  label: { fontSize: 18, marginBottom: 8 },
  horseItem: {
    flex: 1,
    margin: 4,
    padding: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    borderRadius: 4,
  },
  selectedHorse: { backgroundColor: "#00adf5" },
  horseText: { fontSize: 16 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  rowCol: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  column: { fontSize: 16, flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    borderRadius: 4,
    width: 80,
    textAlign: "center",
  },
  result: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 16 },
});
