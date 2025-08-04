import React, { useContext, useEffect, useState } from "react";
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
} from "victory"; // ← victory ではなく victory-native に変更
import { Picker } from "@react-native-picker/picker";
import { calendarData } from "../data/calendarData";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../src/context/AuthContext";

export default function Dashboard() {
  const { logout } = useContext(AuthContext)!; 
  const navigation = useNavigation();
  const [summary, setSummary] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [maxY, setMaxY] = useState(0);
  const [minY, setMinY] = useState(0);
  const [tickValues, setTickValues] = useState([]);

  const filterByFiscalYear = (data, year) => {
    const start = new Date(`${year}-04-01`);
    const end = new Date(`${parseInt(year) + 1}-03-31`);
    return data.filter((item) => {
      const date = new Date(item.x);
      return date >= start && date <= end;
    });
  };

  const handleLogout = async () => {
    try {
      console.log("🧹 Logging out...");
      await logout(); 
      console.log("✅ Logout complete");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      Alert.alert("ログアウト失敗", "もう一度お試しください。");
    }
  };


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

        if (response.status === 401) {
          await AsyncStorage.removeItem("token");
          Alert.alert("セッション切れ", "再度ログインしてください。");
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
          return;
        }

        const data = await response.json();
        setSummary(data);

        if (!data.daily || !Array.isArray(data.daily)) return;

        const converted = data.daily
          .map((entry) => {
            const actualDate = findActualDate(
              calendarData,
              entry.date_info,
              entry.location,
              entry.round
            );
            return actualDate
              ? { x: actualDate, y: entry.total_amount }
              : null;
          })
          .filter((item) => item !== null);

        const sorted = converted.sort(
          (a, b) => new Date(a.x) - new Date(b.x)
        );
        setChartData(sorted);
      } catch (error) {
        console.error("エラーが発生しました:", error);
        Alert.alert("バックエンドへのリクエストに失敗しました。");
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const fiscalData = filterByFiscalYear(chartData, selectedYear);
    setFilteredData(fiscalData);

    const yValues = fiscalData.map((d) => d.y);
    const max = yValues.length > 0 ? Math.max(...yValues) : 0;
    const min = yValues.length > 0 ? Math.min(...yValues) : 0;

    const niceMax = Math.ceil(max / 10000) * 10000;
    const niceMin = Math.floor(min / 10000) * 10000;

    const step = (niceMax - niceMin) / 4 || 1;
    const ticks = [];
    for (let i = niceMin; i <= niceMax; i += step) {
      ticks.push(Math.round(i));
    }

    setTickValues(ticks);
    setMaxY(niceMax);
    setMinY(niceMin);
  }, [chartData, selectedYear]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>日別賭け金グラフ（年度別）</Text>

      <Picker
        selectedValue={selectedYear}
        onValueChange={(itemValue) => setSelectedYear(itemValue)}
        style={styles.picker}
      >
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
        <Text style={styles.logoutText} onPress={handleLogout}>
          ログアウト
        </Text>
      </View>
    </View>
  );
}

// 📅 カレンダーから日付を特定
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
  picker: {
    marginBottom: 16,
    height: 50,
    width: 200,
    alignSelf: "center",
  },
  logoutContainer: {
    marginTop: 20,
    alignItems: "center",
  },
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
