import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";

import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryLegend,
} from "victory";

import courseMaster from "../../assets/cource.json";
import raceHistory from "../../assets/raceHistory.json";


export default function GradeRaceDetail() {
  const route = useRoute();
  const { race } = route.params;

  const [chartData, setChartData] = useState([]);



  // コースマスタからcourseKeyで検索
  const course = courseMaster[race.courseKey];

  useEffect(() => {
    // 同じレース名の履歴をすべて取得
    const targetHistories = raceHistory.filter(
      (h) => h.raceName === race.raceName
    );

    if (targetHistories.length > 0) {
      const allLapData = targetHistories.map((history) => ({
        year: history.date.split(".")[0], // 年だけ抽出
        data: history.lapTimes.map((time, index) => ({
          x: index + 1,
          y: parseFloat(time),
        })),
      }));
      console.log("=== グラフ用データ ===", allLapData);
      setChartData(allLapData);
    }
  }, [race.raceName]);

  // domain の自動計算
  const yValues = chartData.flatMap((d) => d.data.map((p) => p.y));
  const yMin = yValues.length > 0 ? Math.min(...yValues) - 0.5 : 10;
  const yMax = yValues.length > 0 ? Math.max(...yValues) + 0.5 : 14;

  // カラーリスト
  const colors = ["#00bcd4", "#ff9800", "#4caf50", "#e91e63"];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* レース情報 */}
      <View style={styles.card}>
        <Text style={styles.title}>{race.raceName}</Text>
        <Text style={styles.label}>
          日付: <Text style={styles.value}>{race.date}</Text>
        </Text>
        <Text style={styles.label}>
          場所: <Text style={styles.value}>{race.venue}</Text>
        </Text>
        <Text style={styles.label}>
          グレード: <Text style={styles.value}>{race.grade}</Text>
        </Text>
        <Text style={styles.label}>
          距離: <Text style={styles.value}>{race.distance}</Text>
        </Text>
      </View>

      {/* コース説明 */}
      {course && (
        <View style={styles.card}>
          <Text style={styles.subtitle}>コース説明</Text>
          <Text style={styles.description}>{course.courseDescription}</Text>
          <Text style={styles.subtitle}>馬場状態２０２５</Text>
          <Text style={styles.description}>{course.courseMemo}</Text>
          <Image
            source={{ uri: course.courseImage }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}

      {/* ラップタイムグラフ */}
      <Text style={styles.title}>ラップタイム比較</Text>
      {chartData.length > 0 ? (
        <VictoryChart domain={{ y: [yMin, yMax] }} height={350}>
          <VictoryLegend
            x={80}
            y={20}
            orientation="horizontal"
            gutter={20}
            data={chartData.map((d, idx) => ({
              name: `${d.year}年`,
              symbol: { fill: colors[idx % colors.length] },
            }))}
          />
          <VictoryAxis
            tickFormat={(x) => `${x}F`}
            style={{ tickLabels: { fontSize: 12 } }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(y) => `${y.toFixed(1)}秒`}
            style={{ tickLabels: { fontSize: 12 } }}
          />
          {chartData.map((dataset, idx) => (
            <VictoryLine
              key={`line-${idx}`}
              data={dataset.data}
              style={{
                data: {
                  stroke: colors[idx % colors.length],
                  strokeWidth: 3,
                },
              }}
            />
          ))}
          {chartData.map((dataset, idx) => (
            <VictoryScatter
              key={`scatter-${idx}`}
              data={dataset.data}
              size={3}
              style={{
                data: {
                  fill: colors[idx % colors.length],
                },
              }}
            />
          ))}
        </VictoryChart>
      ) : (
        <Text>ラップタイムデータがありません。</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
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
