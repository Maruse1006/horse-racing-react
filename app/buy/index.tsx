import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { calendarData, placeData } from "@/data/calendarData";

// ルートパラメーターの型定義
type RouteParams = {
  date: string;
  place: string;
  race: string;
};

// RoutePropを使ってuseRouteの型を設定
type RouteProps = RouteProp<{ params: RouteParams }, "params">;

export default function RaceSelectionScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [dayCount, setDayCount] = useState<string | null>(null); // 開催日数の状態管理
  const [round, setRound] = useState<string | null>(null); // 開催回数の状態管理

  const navigation = useNavigation(); // Navigationフックを使用
  const route = useRoute<RouteProps>(); // useRouteの型指定
  const { date, place, race } = route.params || {}; // パラメーター取得

  console.log("Received params:", { date, place, race });

  // 特定の日付と競馬場の開催日数・開催回数を取得
  const getDayCountAndRound = (date: string | null, placeId: string | null) => {
    if (!date || !placeId || !calendarData[date]) return { day: null, round: null };

    const schedule = calendarData[date].find((entry) => entry.placeId === placeId);

    return schedule
      ? { day: schedule.day, round: schedule.round }
      : { day: null, round: null };
  };

  // 日付に基づいた開催場所のデータを取得
  const getPlacesForDate = (date: string | null) => {
    if (!date || !calendarData[date]) return [];
    return calendarData[date]
      .map((schedule) => {
        const place = placeData.find((p) => p.id === schedule.placeId);
        return place
          ? { label: `${schedule.round} ${place.name}`, value: schedule.placeId }
          : null;
      })
      .filter(Boolean);
  };

  // 開催場所を選択したときに開催日数と回数を取得
  const handlePlaceSelection = (value: string | null) => {
    setSelectedPlace(value);
    const { day, round } = getDayCountAndRound(selectedDate, value);
    setDayCount(day);
    setRound(round);
  };

  const places = getPlacesForDate(selectedDate);

  const races = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}R`,
    value: `${i + 1}`,
  }));

  // レース情報を確認する処理
const handleSubmit = () => {
  if (!selectedDate || !selectedPlace || !selectedRace) {
    Alert.alert("エラー", "全ての項目を選択してください！");
    return;
  }

  const raceId = `${selectedDate.replace(/-/g, "")}${selectedPlace}${selectedRace}`;
  Alert.alert("レース情報", `選択したレースID: ${raceId}`);
};


  // 式別画面に遷移する処理
  const navigateToBettingOptions = () => {
    if (!selectedDate || !selectedPlace || !selectedRace || !dayCount || !round) {
      Alert.alert("エラー", "全ての項目を選択してください！");
      return;
    }

    navigation.navigate("bettingTypePage", {
      dayCount: dayCount,
      place: selectedPlace,
      race: selectedRace,
      round: round,
    });
  };

  return (
    <View style={styles.container}>
      

      {/* カレンダー */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={
          selectedDate ? { [selectedDate]: { selected: true, marked: true } } : {}
        }
        theme={{
          selectedDayBackgroundColor: "#00adf5",
          todayTextColor: "#00adf5",
        }}
      />

      {/* 開催場所の選択 */}
      <Text style={styles.label}>開催場所を選択</Text>
      <RNPickerSelect
        onValueChange={handlePlaceSelection}
        items={places}
        value={selectedPlace || undefined}
        placeholder={{ label: "開催場所を選択", value: null }}
      />
      {/* <Text style={styles.label}>開催日数: {dayCount || "未選択"}</Text>
      <Text style={styles.label}>開催回数: {round || "未選択"}</Text> */}

      {/* レース番号の選択 */}
      <Text style={styles.label}>レース番号を選択</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedRace(value)}
        items={races}
        value={selectedRace || undefined}
        placeholder={{ label: "レース番号を選択", value: null }}
      />
      <Text style={styles.label}>
        選択されたレース: {selectedRace || "未選択"}
      </Text>

      {/* 提出ボタン */}
      <Button title="レースを確認" onPress={handleSubmit} />

      {/* 式別画面への遷移ボタン */}
      <Button
        title="式別画面へ移動"
        onPress={navigateToBettingOptions}
        color="#228b22"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
});
