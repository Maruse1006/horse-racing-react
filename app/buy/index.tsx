import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { calendarData } from "@/data/calendarData";

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

  const navigation = useNavigation(); // Navigationフックを使用
  const route = useRoute<RouteProps>(); // useRouteの型指定
  const { date, place, race } = route.params || {}; // パラメーター取得

  console.log("Received params:", { date, place, race });

  // 日付に基づいた開催場所のデータを取得
  const getPlacesForDate = (date: string | null) => {
    if (!date || !calendarData[date]) return [];
    return calendarData[date]
      .map((placeCode: string) => {
        const place = places.find((p) => p.value === placeCode);
        return place ? { label: place.label, value: place.value } : null;
      })
      .filter(Boolean);
  };

  const places = [
    { label: "札幌", value: "01" },
    { label: "函館", value: "02" },
    { label: "福島", value: "03" },
    { label: "新潟", value: "04" },
    { label: "東京", value: "05" },
    { label: "中山", value: "06" },
    { label: "中京", value: "07" },
    { label: "京都", value: "08" },
    { label: "阪神", value: "09" },
    { label: "小倉", value: "10" },
  ];

  const races = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}R`,
    value: `${i + 1}`,
  }));

  // レース選択後の処理
  const handleSubmit = () => {
    if (!selectedDate || !selectedPlace || !selectedRace) {
      Alert.alert("エラー", "全ての項目を選択してください！");
      return;
    }

    const raceId = `${selectedDate.replace(/-/g, "")}${selectedPlace}${selectedRace}`;
    Alert.alert("レース情報", `選択したレースID: ${raceId}`);
  };

  // 選択した日付に基づいた開催場所リストを取得
  const filteredPlaces = getPlacesForDate(selectedDate);

  // 式別画面に遷移する処理
  const navigateToBettingOptions = () => {
    navigation.navigate("bettingTypePage", {
      date: selectedDate,
      place: selectedPlace,
      race: selectedRace,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>レース選択</Text>

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
        onValueChange={(value) => setSelectedPlace(value)}
        items={filteredPlaces}
        value={selectedPlace || undefined}
        placeholder={{ label: "開催場所を選択", value: null }}
      />

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
