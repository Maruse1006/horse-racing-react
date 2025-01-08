import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

const horsesData = [
  { number: 1, name: "ミヤジレガリア" },
  { number: 2, name: "クリニクラウン" },
  { number: 3, name: "ミッキーマカロン" },
  { number: 4, name: "テーオールビー" },
  { number: 5, name: "ビジョンブラッド" },
  { number: 6, name: "チカミリオン" },
  { number: 7, name: "ラヴオントップ" },
  { number: 8, name: "ルナビス" },
  { number: 9, name: "ネバーモア" },
  { number: 10, name: "サルサディーバ" },
  { number: 11, name: "ゼットレジーナ" },
  { number: 12, name: "その他" },
];

export default function AxisFormationScreen() {
  const [axisHorse, setAxisHorse] = useState<number | null>(null); // 軸馬
  const [selectedHorses, setSelectedHorses] = useState<number[]>([]); // 紐馬

  const toggleHorse = (horse: number) => {
    setSelectedHorses((prev) =>
      prev.includes(horse) ? prev.filter((h) => h !== horse) : [...prev, horse]
    );
  };

  const handleAxisSelect = (horse: number) => {
    if (axisHorse === horse) {
      setAxisHorse(null); // 軸馬を解除
    } else {
      setAxisHorse(horse); // 軸馬を選択
      setSelectedHorses((prev) => prev.filter((h) => h !== horse)); // 紐馬から削除
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>三連複 軸1頭流し</Text>

      {/* 軸馬選択 */}
      <Text style={styles.subTitle}>軸馬を選択してください:</Text>
      <FlatList
        data={horsesData}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.horseItem,
              axisHorse === item.number && styles.axisHorse,
            ]}
            onPress={() => handleAxisSelect(item.number)}
          >
            <Text style={styles.horseNumber}>{item.number}</Text>
            <Text style={styles.horseName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 紐馬選択 */}
      <Text style={styles.subTitle}>紐馬を選択してください:</Text>
      <FlatList
        data={horsesData.filter((horse) => horse.number !== axisHorse)} // 軸馬以外を表示
        keyExtractor={(item) => item.number.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.horseItem,
              selectedHorses.includes(item.number) && styles.selectedHorse,
            ]}
            onPress={() => toggleHorse(item.number)}
          >
            <Text style={styles.horseNumber}>{item.number}</Text>
            <Text style={styles.horseName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
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
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  horseItem: {
    flex: 1,
    margin: 4,
    padding: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    borderRadius: 4,
  },
  axisHorse: {
    backgroundColor: "#ffcccb", // 軸馬は赤色
  },
  selectedHorse: {
    backgroundColor: "#add8e6", // 紐馬は青色
  },
  horseNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  horseName: {
    fontSize: 14,
  },
});
