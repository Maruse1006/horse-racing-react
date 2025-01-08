import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

export default function TrioBoxScreen() {
  const horses = Array.from({ length: 16 }, (_, i) => i + 1); // 1〜16の馬番号
  const [selectedHorses, setSelectedHorses] = useState<number[]>([]);

  const toggleHorse = (horse: number) => {
    setSelectedHorses((prev) =>
      prev.includes(horse)
        ? prev.filter((h) => h !== horse)
        : [...prev, horse]
    );
  };

  const generateCombinations = (horses: number[]) => {
    const combinations: number[][] = [];
    for (let i = 0; i < horses.length; i++) {
      for (let j = i + 1; j < horses.length; j++) {
          combinations.push([horses[i], horses[j]]);
      }
    }
    return combinations;
  };

  const combinations = generateCombinations(selectedHorses);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>馬連ボックス</Text>

      {/* 馬番号を表示 */}
      <FlatList
        data={horses}
        numColumns={4}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.horseItem,
              selectedHorses.includes(item) && styles.selectedHorse,
            ]}
            onPress={() => toggleHorse(item)}
          >
            <Text style={styles.horseText}>{item}</Text>
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
});
