import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 各画面をインポート
import RaceSelectionScreen from "../app/buy/index";
import BettingOptionsScreen from "../app/bettingTypePage";
import TrifectaBeddingType from "../app/trifecta/trifectaBeddingType";
import TrifectaCombination from "../app/trifectaCombination";
import Blood from "../app/blood";
import Layout from "../app/(tabs)/_layout";
import winBet from "../app/winBet";
import WinBet from "../app/winBet";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Layout">
        {/* ホーム画面 */}
        <Stack.Screen
          name="Layout"
          component={Layout}
          options={{ headerShown: false }}
        />
        {/* 血統検索画面 */}
        <Stack.Screen
          name="Blood"
          component={Blood}
          options={{ title: "血統検索" }}
        />
        {/* 他の画面 */}
        <Stack.Screen
          name="RaceSelection"
          component={RaceSelectionScreen}
          options={{ title: "レース選択" }}
        />
        <Stack.Screen
          name="bettingTypePage"
          component={BettingOptionsScreen}
          options={{ title: "式別" }}
        />
        <Stack.Screen
          name="trifectaBeddingType"
          component={TrifectaBeddingType}
          options={{ title: "三連複" }}
        />

        <Stack.Screen
          name="WinBet"
          component={WinBet}
          options={{ title: "単勝" }}
        />
        <Stack.Screen
          name="trifectaCombination"
          component={TrifectaCombination}
          options={{ title: "三連複組み合わせ" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
