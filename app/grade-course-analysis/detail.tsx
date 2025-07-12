import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";

// コースマスタJSONをインポート
import courseMaster from "../../assets/cource.json";

export default function GradeRaceDetail() {
  const route = useRoute();
  const { race } = route.params;

  // コースマスタからcourseKeyで検索
  const course = courseMaster[race.courseKey];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* レース情報 */}
      <View style={styles.card}>
        <Text style={styles.title}>{race.raceName}</Text>
        <Text style={styles.label}>日付: <Text style={styles.value}>{race.date}</Text></Text>
        <Text style={styles.label}>場所: <Text style={styles.value}>{race.venue}</Text></Text>
        <Text style={styles.label}>グレード: <Text style={styles.value}>{race.grade}</Text></Text>
        <Text style={styles.label}>距離: <Text style={styles.value}>{race.distance}</Text></Text>
      </View>

      {/* コース説明 */}
      {course && (
        <View style={styles.card}>
          <Text style={styles.subtitle}>コース説明</Text>
          <Text style={styles.description}>{course.courseDescription}</Text>
          <Image
            source={{ uri: course.courseImage }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  value: {
    fontWeight: "400",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});
