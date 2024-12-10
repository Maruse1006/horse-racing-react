import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from "react-native";

export default function TrioFormationScreen() {
  const horses = Array.from({ length: 16 }, (_, i) => i + 1); // 1〜16の馬番号
  const [firstRow, setFirstRow] = useState<number[]>([]);
  const [secondRow, setSecondRow] = useState<number[]>([]);
  const [thirdRow, setThirdRow] = useState<number[]>([]);

  const toggleSelection = (rowSetter, row, horse) => {
    rowSetter((prev) =>
      prev.includes(horse) ? prev.filter((h) => h !== horse) : [...prev, horse]
    );
  };

  const selectAll = (rowSetter) => {
    rowSetter(horses);
  };

  const clearSelection = (rowSetter) => {
    rowSetter([]);
  };

  const calculateCombinations = () => {
    const combinations = [];
    for (let a of firstRow) {
      for (let b of secondRow) {
        for (let c of thirdRow) {
          if (a !== b && a !== c && b !== c) {
            combinations.push([a, b, c].sort((x, y) => x - y)); // ソートして重複排除
          }
        }
      }
    }
    const uniqueCombinations = Array.from(
      new Set(combinations.map((combo) => JSON.stringify(combo)))
    ).map((combo) => JSON.parse(combo));
    return uniqueCombinations;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>三連複フォーメーション</Text>

      {/* 1列目 */}
      <View style={styles.row}>
        <Text style={styles.label}>1頭目</Text>
        <FlatList
          data={horses}
          numColumns={4}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.horseItem,
                firstRow.includes(item) && styles.selectedHorse,
              ]}
              onPress={() => toggleSelection(setFirstRow, firstRow, item)}
            >
              <Text style={styles.horseText}>{item}</Text>
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
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.horseItem,
                secondRow.includes(item) && styles.selectedHorse,
              ]}
              onPress={() => toggleSelection(setSecondRow, secondRow, item)}
            >
              <Text style={styles.horseText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.buttonRow}>
          <Button title="全通り" onPress={() => selectAll(setSecondRow)} />
          <Button title="クリア" onPress={() => clearSelection(setSecondRow)} />
        </View>
      </View>

      {/* 3列目 */}
      <View style={styles.row}>
        <Text style={styles.label}>3頭目</Text>
        <FlatList
          data={horses}
          numColumns={4}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.horseItem,
                thirdRow.includes(item) && styles.selectedHorse,
              ]}
              onPress={() => toggleSelection(setThirdRow, thirdRow, item)}
            >
              <Text style={styles.horseText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.buttonRow}>
          <Button title="全通り" onPress={() => selectAll(setThirdRow)} />
          <Button title="クリア" onPress={() => clearSelection(setThirdRow)} />
        </View>
      </View>

      {/* 組み合わせ結果 */}
      <Text style={styles.result}>
        総組み合わせ数: {calculateCombinations().length}
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
