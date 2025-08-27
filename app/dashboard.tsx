import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Alert, Text, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
} from "victory";
import { Picker } from "@react-native-picker/picker";
import { calendarData } from "../data/calendarData";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../src/context/AuthContext";

const TOKEN_KEY = "accessToken";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function Dashboard() {
  const { logout } = useContext(AuthContext)!;
  const navigation = useNavigation();
  const [summary, setSummary] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{ x: string; y: number }[]>([]);
  const [filteredData, setFilteredData] = useState<{ x: string; y: number }[]>([]);
  const [selectedYear, setSelectedYear] = useState("-");
  const [maxY, setMaxY] = useState(0);
  const [minY, setMinY] = useState(0);
  const [tickValues, setTickValues] = useState<number[]>([]);

  // 強制ログアウト
  const forceLogout = async (reason: string) => {
    console.log("forceLogout:", reason);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await logout();
    navigation.reset({ index: 0, routes: [{ name: "Login" as never }] });
  };

  // 認証付きGET
  const authGet = async (path: string) => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log("authGet: token not found in storage");
      return new Response(null, { status: 401 }) as any;
    }
    console.log("authGet: token found, length=", token.length);
    if (!API_URL) {
      console.log("authGet: API_URL is undefined!");
      return new Response(null, { status: 400 }) as any;
    }
    const url = `${API_URL}${path}`;
    console.log("authGet: fetching", url);
    return fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
  };

  // 初回データ取得
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await authGet(`/api/bet-summary`);
        if (!res) {
          console.log("fetchSummary: no response object");
          return;
        }

        console.log("fetchSummary: response status", res.status);

        if ([401, 403, 422].includes(res.status)) {
          console.log("fetchSummary: got auth error -> forceLogout");
          try {
            const body = await res.clone().text();
            console.log("fetchSummary: error body:", body);
          } catch {}
          await forceLogout("response status " + res.status);
          return;
        }
        if (!res.ok) {
          const body = await res.clone().text().catch(() => "");
          console.log("fetchSummary: non-ok response", res.status, body);
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        console.log("fetchSummary: success, daily length=", data?.daily?.length);
        setSummary(data);

        if (!data?.daily || !Array.isArray(data.daily)) {
          console.log("fetchSummary: daily missing or not array");
          return;
        }

        const converted = data.daily
          .map((entry: any) => {
            const actualDate = findActualDate(
              calendarData,
              entry.date_info,
              entry.location,
              entry.round
            );
            return actualDate ? { x: actualDate, y: entry.total_amount } : null;
          })
          .filter(Boolean) as { x: string; y: number }[];

        const sorted = converted.sort(
          (a, b) => +new Date(a.x) - +new Date(b.x)
        );
        console.log("fetchSummary: chartData count", sorted.length);
        setChartData(sorted);
      } catch (error) {
        console.log("fetchSummary: exception", error);
        Alert.alert("バックエンドへのリクエストに失敗しました。");
      }
    };

    (async () => {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (!token) {
        console.log("mount: no token in storage -> forceLogout");
        await forceLogout("no token at mount");
        return;
      }
      console.log("mount: token exists, length=", token.length);
      fetchSummary();
    })();
  }, []);

  // 年度ごとのデータ再計算
  useEffect(() => {
    const fiscalData = filterByFiscalYear(chartData, selectedYear);
    setFilteredData(fiscalData);

    const yValues = fiscalData.map((d) => d.y);
    const max = yValues.length > 0 ? Math.max(...yValues) : 0;
    const min = yValues.length > 0 ? Math.min(...yValues) : 0;

    const niceMax = Math.ceil(max / 10000) * 10000;
    const niceMin = Math.floor(min / 10000) * 10000;
    const step = (niceMax - niceMin) / 4 || 1;
    const ticks: number[] = [];
    for (let i = niceMin; i <= niceMax; i += step) ticks.push(Math.round(i));

    console.log("chart recalculated:", {
      selectedYear,
      fiscalCount: fiscalData.length,
      minY: niceMin,
      maxY: niceMax,
      tickCount: ticks.length,
    });

    setTickValues(ticks);
    setMaxY(niceMax);
    setMinY(niceMin);
  }, [chartData, selectedYear]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>日別賭け金グラフ（年度別）</Text>

      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue) => {
          console.log("Picker change", selectedYear, "->", itemValue);
          setSelectedYear(itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="-" value="-" />
        <Picker.Item label="2023年度" value="2023" />
        <Picker.Item label="2024年度" value="2024" />
        <Picker.Item label="2025年度" value="2025" />
      </Picker>

      {filteredData.length > 0 ? (
        <ScrollView horizontal>
          <View style={{ width: Math.max(400, filteredData.length * 80) }}>
            <VictoryChart
              domain={{ y: [minY, maxY] }}
              width={Math.max(400, filteredData.length * 80)}
              height={300}
              padding={{ top: 20, bottom: 70, left: 70, right: 40 }}
            >
              <VictoryAxis
                tickFormat={(x, index) => {
                  const d = new Date(x);
                  const interval = Math.ceil(filteredData.length / 7);
                  return index % interval === 0
                    ? `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
                    : "";
                }}
                style={{
                  tickLabels: { fontSize: 10, angle: -30, padding: 15 },
                }}
              />
              <VictoryAxis
                dependentAxis
                tickValues={tickValues}
                tickFormat={(y) => y.toLocaleString()}
                style={{ tickLabels: { fontSize: 10, padding: 5 } }}
              />
              <VictoryLine
                data={filteredData}
                interpolation="monotoneX"
                style={{ data: { stroke: "#00bcd4", strokeWidth: 3 } }}
              />
              <VictoryScatter
                data={filteredData}
                size={4}
                style={{ data: { fill: "#00bcd4" } }}
              />
            </VictoryChart>
          </View>
        </ScrollView>
      ) : (
        <Text>データがありません。</Text>
      )}

      {/* ログアウトボタン */}
      <View style={styles.logoutContainer}>
        <Text
          style={styles.logoutText}
          onPress={async () => {
            console.log("manual logout pressed");
            await forceLogout("manual logout pressed");
          }}
        >
          ログアウト
        </Text>
      </View>
    </View>
  );
}

// 📅 カレンダーから日付を特定
function findActualDate(
  calendarData: any,
  dateInfo: string,
  placeId: string,
  round: string
) {
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
}

function filterByFiscalYear(data: { x: string; y: number }[], year: string) {
  if (year === "-") return data;
  const start = new Date(`${year}-04-01`);
  const end = new Date(`${parseInt(year) + 1}-03-31`);
  return data.filter((item) => {
    const date = new Date(item.x);
    return date >= start && date <= end;
  });
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 16 },
  picker: { marginBottom: 16, height: 50, width: 200, alignSelf: "center" },
  logoutContainer: { marginTop: 20, alignItems: "center" },
  logoutText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 5,
  },
});
