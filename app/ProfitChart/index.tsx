import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function DailyProfitChart() {
  const [data, setData] = useState({
    labels: [], // 日付
    datasets: [{ data: [] }], // 収支データ
  });

  useEffect(() => {
    // サーバーからデータを取得（バックエンドにAPIが必要）
    const fetchProfitData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/get_daily_profit_data");
        const result = await response.json();

        if (result.success) {
          const labels = result.data.map((item) => item.date); // 日付を取得
          const values = result.data.map((item) => item.profit); // 収支を取得

          setData({
            labels,
            datasets: [{ data: values }],
          });
        } else {
          console.error("データ取得に失敗しました");
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };

    fetchProfitData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>日ごとの収支グラフ</Text>
      <LineChart
        data={{
          labels: data.labels, // X軸に日付
          datasets: data.datasets, // Y軸に収支額
        }}
        width={screenWidth - 32} // グラフの幅
        height={220} // グラフの高さ
        yAxisLabel="¥" // Y軸のラベル
        chartConfig={{
          backgroundColor: "#022173",
          backgroundGradientFrom: "#1a2a6c",
          backgroundGradientTo: "#b21f1f",
          decimalPlaces: 0, // 小数点以下の桁数
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726",
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
