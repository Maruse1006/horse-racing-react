import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// Base64デコード用にBufferを使用
import { Buffer } from "buffer";

export default function PlaceBet() {
    const [horses, setHorses] = useState([]); // 馬データ用のステート
    const [combinations, setCombinations] = useState([]);
    const [betAmounts, setBetAmounts] = useState<{ [key: string]: string }>({});
    const [payout, setPayout] = useState(0); // 払い戻し金額
    const navigation = useNavigation();
    const route = useRoute();
    const { year, dayCount, place, race, round } = route.params || {};
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    useEffect(() => {
        // 馬データをバックエンドから取得
        const fetchHorses = async () => {
            try {
                const response = await fetch(`${API_URL}/api/get_horses`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ year, dayCount, place, race, round }),
                });
                const data = await response.json();
                if (data.success) {
                    // 馬データを番号順にソートして保存
                    const sortedHorses = data.horses.sort((a, b) => parseInt(a.number) - parseInt(b.number));
                    setHorses(sortedHorses); // ソート済みの馬データを保存
                } else {
                    alert("馬データの取得に失敗しました。");
                }
            } catch (error) {
                console.error("エラーが発生しました:", error);
                alert("バックエンドへのリクエストに失敗しました。");
            }
        };

        console.log("Received parameters:", { year, dayCount, place, race, round });
        fetchHorses(); // データを取得する関数を呼び出し
    }, [year, dayCount, place, race, round]);

    const toggleSelection = (rowSetter, row, horse) => {
        rowSetter((prev) =>
            prev.includes(horse) ? prev.filter((h) => h !== horse) : [...prev, horse]
        );
    };

    const selectAll = (rowSetter) => {
        rowSetter(horses.map((horse) => horse.number)); // 馬番号で全選択
    };

    const clearSelection = (rowSetter) => {
        rowSetter([]);
    };

    const handleBetAmountChange = (horseNumber: string, value: string) => {
        setBetAmounts((prev) => ({ ...prev, [horseNumber]: value }));
    };
    const formatToTwoDigits = (value) => {
        if (typeof value === "string" && !isNaN(value)) {
            return value.padStart(2, "0");
        }
        if (typeof value === "number") {
            return value.toString().padStart(2, "0");
        }
        return value;
    };

    const getUserIdFromToken = (token) => {
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


    const checkPayout = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                alert('ログインしてください。');
                return;
            }

            const userId = getUserIdFromToken(token);
            if (!userId) {
                alert('ユーザー認証に問題があります。');
                return;
            }


            const formattedPayload = {
                userId,
                name: "複勝",
                year:year,
                dayCount: formatToTwoDigits(dayCount),
                place: formatToTwoDigits(place),
                race: formatToTwoDigits(race),
                round: formatToTwoDigits(round),
                combinations: formatToTwoDigits(combinations),
                amounts: combinations.map((c) => Number(betAmounts[c] || 0)),

            };

            console.log("Payload being sent:", formattedPayload);

            const response = await fetch(`${API_URL}/api/check_payout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedPayload),
            });

            const data = await response.json();

            if (data.success) {
                setPayout(data.payout);
            } else {
                setPayout(0);
                alert("該当する払い戻しがありません。");
            }
        } catch (error) {
            console.error("エラーが発生しました:", error);
            alert("バックエンドへのリクエストに失敗しました。");
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>複勝</Text>

                <View style={styles.row}>
                    <FlatList
                        data={horses}
                        numColumns={4}
                        keyExtractor={(item) => item.number.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.horseItem,
                                    combinations.includes(item.number) && styles.selectedHorse,
                                ]}
                                onPress={() => toggleSelection(setCombinations, combinations, item.number)}
                            >
                                <Text style={styles.horseText}>{item.number}. {item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                {combinations.map((number) => (
                    <View key={number} style={styles.row}>
                        <Text style={styles.label}>{number}番 </Text>
                        <TextInput
                            keyboardType="numeric"
                            style={styles.input}
                            value={betAmounts[number] || ""}
                            onChangeText={(val) => handleBetAmountChange(number, val)}
                            placeholder="賭け金"
                        />
                    </View>
                ))}
                <View style={styles.buttonRow}>
                    <Button title="全通り" onPress={() => selectAll(setCombinations)} />
                    <Button title="クリア" onPress={() => clearSelection(setCombinations)} />
                </View>
                <Button title="払い戻し金額を確認" onPress={checkPayout} />
                <Text style={styles.result}>
                    払い戻し金額: {payout > 0 ? `¥${payout}` : "該当なし"}
                </Text>

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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10
    },

    label: {
        fontSize: 16,
        flex: 1
    },
    horseItem: {
        flex: 1,
        margin: 4,
        padding: 10,
        backgroundColor: "#f0f0f0",
        alignItems: "center",
        borderRadius: 4,
    },
    selectedHorse: {
        backgroundColor: "#00adf5",
    },
    horseText: {
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    result: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 16,
    },
    input: {
        marginLeft: 10,
        flex: 1
    }
});
