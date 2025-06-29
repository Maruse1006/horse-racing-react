import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

// JSONファイルをassetsフォルダに保存している前提
import raceData from "../../assets/grade_race_2025.json";

export default function GradeRaceList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(raceData);
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.raceName}</Text>
      <Text>{item.date} | {item.venue} | {item.grade} | {item.distance}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  card: { marginBottom: 12, padding: 12, backgroundColor: "#f0f0f0", borderRadius: 8 },
  title: { fontWeight: "bold", fontSize: 16 },
});
