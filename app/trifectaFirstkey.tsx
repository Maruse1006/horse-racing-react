import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TrioFirstKeyScreen() {
  const [horses, setHorses] = useState([]); // 馬データ用のステート
  const [firstRow, setFirstRow] = useState([]); // 1着候補
  const [secondRow, setSecondRow] = useState([]); // 2・3着候補
  const [payout, setPayout] = useState(0); // 払い戻し金額

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
    fetchHorses(); // データを取得する関数を呼び出し
  }, [dayCount, place, race, round]);

  const toggleSelection = (rowSetter, row, horse, isSingleSelection = false) => {
    rowSetter((prev) =>
      prev.includes(horse)
        ? prev.filter((h) => h !== horse) // 解除
        : isSingleSelection
        ? [horse] // 1頭だけ選択
        : [...prev, horse] // 複数選択
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
      for (let i = 0; i < secondRow.length; i++) {
        for (let j = i + 1; j < secondRow.length; j++) {
          const b = secondRow[i];
          const c = secondRow[j];
          console.log("b:"+b,"c:"+c)
          console.log("i:"+i,"j:"+j)
          console.log("組み合わせ:"+a,b,c)
          // console.log(i,j)
          if (a !== b && a !== c) {
            // b, c と c, b の両方を考慮
            combinations.push([a, b, c]);
            combinations.push([a, c, b]);
          }
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
        name: "三連単",
        dayCount: formatToTwoDigits(dayCount),
        place: formatToTwoDigits(place),
        race: formatToTwoDigits(race),
        round: formatToTwoDigits(round),
        combinations: calculateCombinations(),
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

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>三連単１着流し</Text>
    
        {/* 1列目 */}
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
                <Text style={styles.horseText}>
                  {item.number}. {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonRow}>
            <Button title="クリア" onPress={() => clearSelection(setFirstRow)} />
          </View>
        </View>

        {/* 2列目 */}
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

        <Text style={styles.result}>
          総組み合わせ数: {calculateCombinations().length}
        </Text>
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
});
