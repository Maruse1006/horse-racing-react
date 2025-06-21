import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import RNPickerSelect from "react-native-picker-select";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { calendarData, placeData } from "../../data/calendarData";

// ルートパラメーターの型定義
type RouteParams = {
  year:string,
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

  const navigation = useNavigation<any>();
  const route = useRoute<RouteProps>();
  const { year,date, place, race } = route.params || {};

  // 日付と開催場所に対応する day/round を取得
  const getDayCountAndRound = (date: string | null, placeId: string | null) => {
    if (!date || !placeId || !calendarData[date]) return { day: null, round: null };
    const schedule = calendarData[date].find((entry) => entry.placeId === placeId);
    const year = schedule?.year;
    return schedule
      ? { day: schedule.day, round: schedule.round }
      : { day: null, round: null };
  };

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

  const handleSubmit = () => {
    if (!selectedDate || !selectedPlace || !selectedRace) {
      Alert.alert("エラー", "全ての項目を選択してください！");
      return;
    }

    const raceId = `${selectedDate.replace(/-/g, "")}${selectedPlace}${selectedRace}`;
    Alert.alert("レース情報", `選択したレースID: ${raceId}`);
  };

  // MainStack 経由で betting_type_page に遷移
  const navigateToBettingOptions = () => {
    if (!selectedDate || !selectedPlace || !selectedRace || !dayCount || !round) {
      Alert.alert("エラー", "全ての項目を選択してください！");
      return;
    }

    navigation.navigate("MainStack", {
      screen: "betting_type_page",
      params: {
        year:year,
        dayCount: dayCount,
        place: selectedPlace,
        race: selectedRace,
        round: round,
      },
    });
  };

  return (
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

      <Text style={styles.label}>
        選択されたレース: {selectedRace || "未選択"}
      </Text>

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
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
});
