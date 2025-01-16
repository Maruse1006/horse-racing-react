import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; // Navigation用フック

const bettingOptions = [
    { id: "1", label: "単勝", screen: "winBet" },
    { id: "2", label: "複勝", screen: "placeBet" },
    { id: "3", label: "枠連", screen: "WakurenScreen" },
    { id: "4", label: "馬連", screen: "quinellaBeddingType" },
    { id: "5", label: "ワイド", screen: "wideQuinellaBettingType" },
    { id: "6", label: "馬単", screen: "exacta_betting_type" },
    { id: "7", label: "3連単", screen: "trifectaBettingType" },
    { id: "8", label: "3連複", screen: "tricastBettingType" },
];

export default function BettingOptionsScreen() {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
    const [selectedRace, setSelectedRace] = useState<string | null>(null);
   
    const navigation = useNavigation();
    const route = useRoute();
    const { round, place, race,dayCount } = route.params || {}; // パラメータのデフォルト値はnull

    React.useEffect(() => {
        console.log("Received parameters:", { round, place, race,dayCount });
    }, [round, place, race]);

    const handleOptionPress = (screen: string) => {
        console.log("Navigating to:", screen);
        navigation.navigate(screen, {
            round,  // 遷移元の`route.params`から取得した値
            place,
            race,
            dayCount
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>式別</Text>
            <Text>選択した情報: 日付={round}, 場所={place}, レース番号={race}</Text>
            <FlatList
                data={bettingOptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.optionItem}
                        onPress={() => handleOptionPress(item.screen)}
                    >
                        <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f4f4f4",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
        color: "#fff",
        backgroundColor: "#228b22",
        paddingVertical: 10,
    },
    optionItem: {
        backgroundColor: "#fff",
        padding: 16,
        marginVertical: 4,
        borderRadius: 8,
        borderColor: "#ddd",
        borderWidth: 1,
    },
    optionText: {
        fontSize: 18,
        fontWeight: "500",
        textAlign: "center",
    },
});
