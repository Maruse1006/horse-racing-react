import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const bettingOptions = [
    { id: "1", label: "単勝", screen: "WinBet" },
    { id: "2", label: "複勝", screen: "PlaceBet" },
    { id: "3", label: "枠連", screen: "WakurenScreen" },
    { id: "4", label: "馬連", screen: "QuinellaBeddingType" },
    { id: "5", label: "ワイド", screen: "WideQuinella" },
    { id: "6", label: "馬単", screen: "ExactaBeddingType" },
    { id: "7", label: "3連単", screen: "TrifectaBettingType" },
    { id: "8", label: "3連複", screen: "TricastBetting" },
];

export default function BettingOptionsScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute();
    const { round, place, race, dayCount } = route.params || {};

    useEffect(() => {
        console.log("Received parameters:", { round, place, race, dayCount });
    }, [round, place, race, dayCount]);

    // ✅ 必ずここで関数定義
    const handleOptionPress = (screen: string) => {
        navigation.navigate("MainStack", {
            screen,
            params: {
                round,
                place,
                race,
                dayCount,
            },
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>式別</Text>
            <Text>選択した情報: 開催日数={dayCount}, 場所={place}, レース番号={race}</Text>
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
