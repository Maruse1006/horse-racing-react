import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, TextInput, ScrollView } from "react-native";

export default function TrioFirstKeyScreen() {
  const navigation = useNavigation<any>();
  const [horses, setHorses] = useState([]); // 馬データ用
  const [firstRow, setFirstRow] = useState([]); // 1着候補
  const [secondRow, setSecondRow] = useState([]); // 2・3着候補
  const [payout, setPayout] = useState(0); // 払い戻し金額
  const [betAmounts, setBetAmounts] = useState<{ [key: string]: string }>({}); // 賭け額
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
    for (let a of firstRow) {
      for (let i = 0; i < secondRow.length; i++) {
        for (let j = i + 1; j < secondRow.length; j++) {
          const b = secondRow[i];
          const c = secondRow[j];
          if (a !== b && a !== c) {
            combinations.push([a, b, c]);
            combinations.push([a, c, b]); // 2-3着を入れ替えたパターンも追加
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

  const getUserIdFromToken = (token) => {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.sub?.id;
    } catch (error) {
      console.error('Invalid token:', error);
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
        ), // 金額を配列で送信
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

   const handleGoBack = () => {
        navigation.goBack();
    };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>三連単1着流し</Text>

        {/* 1着候補 */}
        <View style={styles.row}>
          <Text style={styles.label}>1着</Text>
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

        {/* 2・3着候補 */}
        <View style={styles.row}>
          <Text style={styles.label}>2・3着</Text>
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

        {/* 組み合わせ一覧と賭け額入力 */}
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
        {/*  戻るボタン */}
                    <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                        <Text style={styles.backButtonText}>戻る</Text>
                    </TouchableOpacity>
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
  result: { 
    fontSize: 18, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginTop: 16 },
        backButton: {
        backgroundColor: "#2196F3",
        padding: 12,
        marginTop: 16,
        borderRadius: 8,
    },
    backButtonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
    },
});
