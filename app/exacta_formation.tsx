import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ExactaFormationScreen() {
  const [horses, setHorses] = useState([]); // 馬データ用のステート
  const [firstRow, setFirstRow] = useState([]);
  const [secondRow, setSecondRow] = useState([]);
  const [payout, setPayout] = useState(0); // 払い戻し金額
  const [betAmounts, setBetAmounts] = useState<{ [key: string]: string }>({});
  const navigation = useNavigation();
  const route = useRoute();
  const { dayCount, place, race, round } = route.params || {};

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

  const toggleSelection = (rowSetter, row, horse) => {
    rowSetter((prev) =>
      prev.includes(horse) ? prev.filter((h) => h !== horse) : [...prev, horse]
    );
  };

  const selectAll = (rowSetter) => {
    rowSetter(horses.map((horse) => horse.number)); // 馬番号で全選択
  };

  const clearSelection = (rowSetter) => {
    rowSetter([]);
  };

  const calculateCombinations = () => {
    const combinations = [];
    for (let a of firstRow) {
      for (let b of secondRow) {
        if (a !== b) {
          combinations.push([a, b].sort((x, y) => x - y));
        }
      }
    }
    return Array.from(new Set(combinations.map(JSON.stringify))).map(JSON.parse);
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
      const payload = token.split('.')[1]; // JWTのペイロード部分を取得
      const decodedPayload = JSON.parse(atob(payload)); // Base64デコードしてJSONに変換
      return decodedPayload.sub?.id; // ペイロード内のユーザーIDを取得
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

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

      const combinationsWithBetAmounts = calculateCombinations(
        
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


      const formattedPayload = {
        userId,
        name: "馬単",
        dayCount: formatToTwoDigits(dayCount),
        place: formatToTwoDigits(place),
        race: formatToTwoDigits(race),
        round: formatToTwoDigits(round),
        combinations:combinationsWithBetAmounts
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

  const handleBetAmountChange = (combinationKey: string, value: string) => {
    setBetAmounts((prev) => ({
      ...prev,
      [combinationKey]: value,
    }));
  };

  const combinations = calculateCombinations();


  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>馬単</Text>
        {/* 1列目 */}
        <View style={styles.row}>
          <Text style={styles.label}>1頭目</Text>
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
                onPress={() => toggleSelection(setFirstRow, firstRow, item.number)}
              >
                <Text style={styles.horseText}>
                  {item.number}. {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonRow}>
            <Button title="全通り" onPress={() => selectAll(setFirstRow)} />
            <Button title="クリア" onPress={() => clearSelection(setFirstRow)} />
          </View>
        </View>

        {/* 2列目 */}
        <View style={styles.row}>
          <Text style={styles.label}>2頭目</Text>
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
                <Text style={styles.horseText}>
                  {item.number}. {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonRow}>
            <Button title="全通り" onPress={() => selectAll(setSecondRow)} />
            <Button title="クリア" onPress={() => clearSelection(setSecondRow)} />
          </View>
        </View>

        {/* 結果表示 */}
        <Text style={styles.result}>
          総組み合わせ数: {calculateCombinations().length}
        </Text>
        <FlatList
          data={combinations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const combinationKey = item.join(",");
            return (
              <View style={styles.rowCom}>
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
    </ScrollView>
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
  row: {
    marginBottom: 16,
  },
  rowCom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  label: {
    fontSize: 18,
    marginBottom: 8,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  result: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
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
