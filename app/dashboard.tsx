import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory";
import { calendarData, placeData } from "../data/calendarData";

export default function Dashboard() {
  const [summary, setSummary] = useState([]);
  const [chartData, setChartData] = useState([]);

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
            const placeId = getPlaceIdByName(entry.location);
            const actualDate = findActualDate(
              calendarData,
              entry.date_info,
              placeId,
              entry.round
            );
            return {
              x: actualDate || entry.date_info,
              y: entry.total_amount,
            };
          })
          .filter((item) => item.x);

        console.log("chartData:", converted);
        setChartData(converted);
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
        <VictoryChart scale={{ y: "log" }}>
          <VictoryAxis fixLabelOverlap />
          <VictoryAxis dependentAxis tickFormat={(y) => y.toLocaleString()} />
          <VictoryLine data={chartData} interpolation="monotoneX" />
        </VictoryChart>
      ) : (
        <Text>データがありません。</Text>
      )}
    </View>
  );
}

// ユーティリティ関数
const getPlaceIdByName = (name) => {
  const place = placeData.find((p) => p.name === name);
  return place ? place.id : null;
};

const findActualDate = (calendarData, dateInfo, placeId, round) => {
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
