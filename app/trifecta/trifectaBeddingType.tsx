import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

// オプションデータ（表示するリスト）
const options = [
  { id: "1", label: "フォーメーション" },
  { id: "2", label: "ボックス" },
  { id: "3", label: "軸 1 頭流し" },
  { id: "4", label: "軸 2 頭流し" },
];

export default function TrifectaBeddingType() {
  const handlePress = (option: string) => {
    console.log(`選択されたオプション: ${option}`);
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>式別</Text>
      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePress(item.label)}
          >
            <Text style={styles.itemText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  title: {
    backgroundColor: "#228B22",
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 10,
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
    marginHorizontal: 16,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
});
