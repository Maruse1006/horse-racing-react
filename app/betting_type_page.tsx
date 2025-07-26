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
    const { year, round, place, race, dayCount } = route.params || {};

    useEffect(() => {
        console.log("Received parameters:", { year, round, place, race, dayCount });
    }, [year, round, place, race, dayCount]);

    const handleOptionPress = (screen: string) => {
        console.log(`選択されたオプション: ${screen}`);
        navigation.navigate("MainStack", {
            screen,
            params: {
                round,
                place,
                race,
                year,
                dayCount,
            },
        });
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>式別</Text>
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

            {/*  戻るボタン */}
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                <Text style={styles.backButtonText}>戻る</Text>
            </TouchableOpacity>
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
    },
});
