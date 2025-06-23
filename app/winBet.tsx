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
} from "react-native";

export default function WinBet() {
    const [horses, setHorses] = useState([]);
    const [combinations, setCombinations] = useState<string[]>([]);
    const [betAmounts, setBetAmounts] = useState<{ [key: string]: string }>({});
    const [payout, setPayout] = useState(0);
    const navigation = useNavigation();
    const route = useRoute();
    const { year, dayCount, place, race, round } = route.params || {};

    useEffect(() => {
        const fetchHorses = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/api/get_horses", {
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
                    alert("馬データの取得に失敗しました。");
                }
            } catch (error) {
                console.error("通信エラー:", error);
                alert("通信に失敗しました。");
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
            const decoded = JSON.parse(atob(payload));
            return decoded.sub?.id;
        } catch {
            return null;
        }
    };

    const formatToTwoDigits = (value: string | number) =>
        value.toString().padStart(2, "0");

    const checkPayout = async () => {
        const token = await AsyncStorage.getItem("token");
        if (!token) return alert("ログインしてください。");

        const userId = getUserIdFromToken(token);
        if (!userId) return alert("ユーザー認証エラー");

        const payload = {
            userId,
            name: "単勝",
            dayCount: formatToTwoDigits(dayCount),
            place: formatToTwoDigits(place),
            race: formatToTwoDigits(race),
            round: formatToTwoDigits(round),
            combinations: combinations.map((c) => formatToTwoDigits(c)),
            amounts: combinations.map((c) => Number(betAmounts[c] || 0)),
        };

        const res = await fetch("http://127.0.0.1:5000/api/check_payout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) {
            setPayout(data.payout);
        } else {
            setPayout(0);
            alert("払い戻しはありません。");
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>単勝</Text>
                <Text>
                    選択: 開催日={dayCount}, 場所={place}, レース={race}, 回={round}
                </Text>

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
});
