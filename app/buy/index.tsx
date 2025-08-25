import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert, ScrollView, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { calendarData, placeData } from "../../data/calendarData";

// ルートパラメーターの型定義
type RouteParams = {
  year: string;
  date: string;
  place: string;
  race: string;
};

type RouteProps = RouteProp<{ params: RouteParams }, "params">;

export default function RaceSelectionScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const [dayCount, setDayCount] = useState<string | null>(null);
  const [round, setRound] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null); // ← 年を管理

  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();
  const { date, place, race: routeRace, year: routeYear } = route.params || {};

  // 日付と開催場所に対応する day/round/year を取得
  const getDayCountAndRound = (date: string | null, placeId: string | null) => {
    if (!date || !placeId || !calendarData[date])
      return { day: null, round: null, year: null };

    const schedule = calendarData[date].find((entry) => entry.placeId === placeId);

    return schedule
      ? {
        day: schedule.day,
        round: schedule.round,
        year: schedule.year ?? date.split("-")[0],
      }
      : { day: null, round: null, year: null };
  };

  // 選択した日付の開催場所一覧を取得
  const getPlacesForDate = (date: string | null) => {
    if (!date || !calendarData[date]) return [];
    return calendarData[date]
      .map((schedule) => {
        const place = placeData.find((p) => p.id === schedule.placeId);
        return place
          ? { label: `${schedule.round} ${place.name}`, value: schedule.placeId }
          : null;
      })
      .filter(Boolean) as { label: string; value: string }[];
  };

  // 開催地選択時
  const handlePlaceSelection = (value: string | null) => {
    setSelectedPlace(value);
    const { day, round, year } = getDayCountAndRound(selectedDate, value);
    setDayCount(day);
    setRound(round);
    setYear(year); // ← 追加
  };

  const places = getPlacesForDate(selectedDate);

  const races = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}R`,
    value: `${i + 1}`,
  }));

  const handleSubmit = () => {
    if (!selectedDate || !selectedPlace || !selectedRace) {
      Alert.alert("エラー", "全ての項目を選択してください！");
      return;
    }

    const raceId = `${selectedDate.replace(/-/g, "")}${selectedPlace}${selectedRace}`;
    Alert.alert("レース情報", `選択したレースID: ${raceId}`);
  };

  // 式別画面へ遷移
  const navigateToBettingOptions = () => {
    if (!selectedDate || !selectedPlace || !selectedRace || !dayCount || !round || !year) {
      Alert.alert("エラー", "全ての項目を選択してください！");
      return;
    }

    navigation.navigate("MainStack", {
      screen: "betting_type_page",
      params: {
        year,
        dayCount,
        place: selectedPlace,
        race: selectedRace,
        round,
      },
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
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

        <Text style={styles.label}>開催場所を選択</Text>
        <RNPickerSelect
          onValueChange={handlePlaceSelection}
          items={places}
          value={selectedPlace || undefined}
          placeholder={{ label: "開催場所を選択", value: null }}
        />

        <Text style={styles.label}>レース番号を選択</Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedRace(value)}
          items={races}
          value={selectedRace || undefined}
          placeholder={{ label: "レース番号を選択", value: null }}
        />

        <Button
          title="式別画面へ移動"
          onPress={navigateToBettingOptions}
          color="#228b22"
        />
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  backButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  }
});
