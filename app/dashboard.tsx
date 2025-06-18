import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory";
import { calendarData } from "../data/calendarData";

export default function Dashboard() {
  const [summary, setSummary] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [maxY, setMaxY] = useState(0);
  const [tickValues, setTickValues] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("トークンがありません。ログインしてください。");
          return;
        }

        const response = await fetch("http://127.0.0.1:5000/api/bet-summary", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setSummary(data);

        const converted = data.daily
          .map((entry) => {
            const actualDate = findActualDate(
              calendarData,
              entry.date_info,
              entry.location, // ← placeIdとして使う
              entry.round
            );

            const result = {
              x: actualDate,
              y: entry.total_amount,
            };

            return result;
          })
          .filter((item) => item.x);

        console.log("✅ 変換後のグラフデータ", converted);
        setChartData(converted);

        // 最大値と目盛計算
        const max = Math.max(...converted.map((d) => d.y), 1);
        const step = Math.pow(10, Math.floor(Math.log10(max)) - 1);
        const ticks = [];
        for (let i = 0; i <= max * 1.1; i += step) {
          ticks.push(i);
        }
        setMaxY(max * 1.1);
        setTickValues(ticks);
      } catch (error) {
        console.error("エラーが発生しました:", error);
        Alert.alert("バックエンドへのリクエストに失敗しました。");
      }
    };

    fetchSummary();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>日別賭け金グラフ</Text>
      {chartData.length > 0 ? (
        <ScrollView horizontal>
          <View style={styles.chartWrapper}>
            <VictoryChart
              width={400}
              height={300}
              domain={{ y: [0, maxY] }}
              padding={{ top: 20, bottom: 50, left: 70, right: 20 }}
            >
              <VictoryAxis fixLabelOverlap />
              <VictoryAxis
                dependentAxis
                tickValues={tickValues}
                tickFormat={(y) => y.toLocaleString()}
                style={{
                  tickLabels: { fontSize: 10, padding: 5 },
                }}
              />
              <VictoryLine data={chartData} interpolation="monotoneX" />
            </VictoryChart>
          </View>
        </ScrollView>
      ) : (
        <Text>データがありません。</Text>
      )}
    </View>
  );
}

// ⬇️ 修正済み findActualDate
const findActualDate = (calendarData, dateInfo, placeId, round) => {
  const normalizedDay = String(dateInfo).padStart(2, "0");
  const normalizedRound = String(round).padStart(2, "0");

  for (const date in calendarData) {
    const entries = calendarData[date];
    for (const entry of entries) {
      if (
        entry.placeId === placeId &&
        entry.round === normalizedRound &&
        entry.day === normalizedDay
      ) {
        return date;
      }
    }
  }

  console.warn("❌ マッチせず:", { placeId, round, dateInfo });
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  chartWrapper: {
    width: 400,
  },
});
