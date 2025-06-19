import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
} from "victory";
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
              entry.location, // location = placeId そのまま使う
              entry.round
            );

            return {
              x: actualDate,
              y: entry.total_amount,
            };
          })
          .filter((item) => item.x);

        console.log("✅ 変換後のグラフデータ", converted);
        setChartData(converted);

        const yValues = converted.map((d) => d.y);
        const max = yValues.length > 0 ? Math.max(...yValues) : 1;
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
          <View style={{ width: Math.max(400, chartData.length * 80) }}>
            <VictoryChart
              domain={{ y: [0, maxY] }}
              width={Math.max(400, chartData.length * 80)}
              height={300}
              padding={{ top: 20, bottom: 70, left: 70, right: 40 }}
            >
              <VictoryAxis
                tickFormat={(x) => {
                  const d = new Date(x);
                  return `${d.getMonth() + 1}月${d.getDate()}日`;
                }}
                style={{
                  tickLabels: {
                    fontSize: 10,
                    angle: -45,
                    padding: 10,
                  },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickValues={tickValues}
                tickFormat={(y) => `${(y / 10000).toFixed(0)}万`}
                style={{
                  tickLabels: { fontSize: 10, padding: 5 },
                }}
              />
              <VictoryLine
                data={chartData}
                interpolation="monotoneX"
                style={{
                  data: { stroke: "#00bcd4", strokeWidth: 3 },
                }}
              />
              <VictoryScatter
                data={chartData}
                size={4}
                style={{
                  data: { fill: "#00bcd4" },
                }}
              />
            </VictoryChart>
          </View>
        </ScrollView>
      ) : (
        <Text>データがありません。</Text>
      )}
    </View>
  );
}

const findActualDate = (calendarData, dateInfo, placeId, round) => {
  // const normalizedDay = String(dateInfo).padStart(2, "0");
  // const normalizedRound = String(round).padStart(2, "0");

  for (const date in calendarData) {
    const entries = calendarData[date];
    for (const entry of entries) {
      if (
        entry.placeId === placeId &&
        entry.round === round &&
        entry.day === dateInfo
      ) {
        return date;
      }
    }
  }

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
});
