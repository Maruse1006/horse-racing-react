import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Button,
    StyleSheet,
    TextInput,
    ScrollView,
    Alert,
} from "react-native";

// Base64デコード用にBufferを使用
import { Buffer } from "buffer";

export default function WinBet() {
    const [horses, setHorses] = useState([]);
    const [combinations, setCombinations] = useState<string[]>([]);
    const [betAmounts, setBetAmounts] = useState<{ [key: string]: string }>({});
    const [payout, setPayout] = useState(0);
    const navigation = useNavigation();
    const route = useRoute();
    const { year, dayCount, place, race, round } = route.params || {};
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        const fetchHorses = async () => {
            try {
                const response = await fetch(`${API_URL}/api/get_horses`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ year, dayCount, place, race, round }),
                });
                const data = await response.json();
                if (data.success) {
                    const sortedHorses = data.horses.sort(
                        (a, b) => parseInt(a.number) - parseInt(b.number)
                    );
                    setHorses(sortedHorses);
                } else {
                    Alert.alert("エラー", "馬データの取得に失敗しました。");
                }
            } catch (error) {
                console.error("通信エラー:", error);
                Alert.alert("エラー", "通信に失敗しました。");
            }
        };

        fetchHorses();
    }, [year, dayCount, place, race, round]);

    const toggleSelection = (horseNumber: string) => {
        setCombinations((prev) =>
            prev.includes(horseNumber)
                ? prev.filter((h) => h !== horseNumber)
                : [...prev, horseNumber]
        );
    };

    const handleBetAmountChange = (horseNumber: string, value: string) => {
        setBetAmounts((prev) => ({ ...prev, [horseNumber]: value }));
    };

    const getUserIdFromToken = (token: string) => {
        try {
            const payload = token.split(".")[1];
            const decodedJson = Buffer.from(payload, "base64").toString("utf-8");
            const decoded = JSON.parse(decodedJson);
            console.log("JWT Payload:", decoded); // デバッグ用
            const userId = parseInt(decoded.sub, 10);
            return userId;
        } catch (e) {
            console.error("JWTデコードエラー", e);
            return null;
        }
    };

    const formatToTwoDigits = (value: string | number) =>
        value.toString().padStart(2, "0");

    const checkPayout = async () => {
        const token = await AsyncStorage.getItem("token");
        console.log("JWT Token:", token); // デバッグ用

        const userId = getUserIdFromToken(token);
        console.log("userId:", userId); // デバッグ用

        if (!userId) {
            Alert.alert("エラー", "ユーザー認証エラー。ログインし直してください。");
            await AsyncStorage.removeItem("token");
            navigation.navigate("Login");
            return;
        }

        const payload = {
            userId: userId,
            year: year,
            name: "単勝", // 単勝指定
            dayCount: formatToTwoDigits(dayCount),
            place: formatToTwoDigits(place),
            race: formatToTwoDigits(race),
            round: formatToTwoDigits(round),
            combinations: combinations.map((num) => formatToTwoDigits(num)), // 馬番だけ
            amounts: combinations.map((num) => Number(betAmounts[num] || 0)) // 金額
        };



        console.log("送信Payload:", payload); // デバッグ用

        try {
            const res = await fetch(`${API_URL}/api/check_payout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log("APIレスポンス:", data); // デバッグ用

            if (data.success) {
                setPayout(data.payout);
            } else {
                setPayout(0);
                Alert.alert("結果", "払い戻しはありません。");
            }
        } catch (error) {
            console.error("API通信エラー:", error);
            Alert.alert("エラー", "サーバーとの通信に失敗しました。");
        }
    };
    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>単勝</Text>
                <FlatList
                    data={horses}
                    numColumns={4}
                    keyExtractor={(item) => item.number}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.horseItem,
                                combinations.includes(item.number) && styles.selectedHorse,
                            ]}
                            onPress={() => toggleSelection(item.number)}
                        >
                            <Text>{item.number}. {item.name}</Text>
                        </TouchableOpacity>
                    )}
                />

                {combinations.map((number) => (
                    <View key={number} style={styles.row}>
                        <Text style={styles.label}>{number}番 馬券</Text>
                        <TextInput
                            keyboardType="numeric"
                            style={styles.input}
                            value={betAmounts[number] || ""}
                            onChangeText={(val) => handleBetAmountChange(number, val)}
                            placeholder="賭け金"
                        />
                    </View>
                ))}

                <Button title="払い戻し金額を確認" onPress={checkPayout} />
                <Text style={styles.result}>
                    払い戻し金額: {payout > 0 ? `¥${payout}` : "該当なし"}
                </Text>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>戻る</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
    row: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    label: { flex: 1, fontSize: 16 },
    input: {
        flex: 1,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 6,
        marginLeft: 10,
        borderRadius: 5,
    },
    horseItem: {
        flex: 1,
        margin: 4,
        padding: 10,
        backgroundColor: "#f0f0f0",
        borderRadius: 4,
        alignItems: "center",
    },
    selectedHorse: {
        backgroundColor: "#00adf5",
    },
    result: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 16,
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
