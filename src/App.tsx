import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 各画面をインポート
import RaceSelectionScreen from "../app/buy/index";
import BettingOptionsScreen from "../app/buy/betting_type_page/index";
import TrifectaBeddingType from "../app/trifecta/trifectaBeddingType";
import TrifectaCombination from "../app/trifecta_formation";
import Blood from "../app/blood/index";
import Layout from "../app/(tabs)/_layout";
import WinBet from "../app/winBet";
import PlaceBet from "../app/placeBet";
import Dashboard from "../app/dashboard";
import Login from "../app/login";
import LoginScreen from "../app/login";
import quinella_bet from "../app/quinella_formation_bet";
import QuinellaBeddingType from "../app/quinellaBeddingType";
import QuinellaFormationScreen from "../app/quinella_formation_bet";
import TrioBoxScreen from "../app/quinella_box";
import QuinellaSingleAxisScreen from "../app/quinella_single_axis";
import ExactaBeddingType from "../app/exacta_betting_type";
import ExactaFormationScreen from "../app/exacta_formation";
import ExactaBox from "../app/exacta_box";
import TricastBeddingType from "../app/tricast_betting_type";
import TricastFormationScreen from "../app/tricast_formation";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login"> {/* 初期ルートを "Login" に変更 */}

        <Stack.Screen name="login" component={LoginScreen} />
        <Stack.Screen name="dashboad" component={Dashboard} />
        <Stack.Screen
          name="Layout"
          component={Layout}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="blood"
          component={Blood}
          options={{ title: "血統検索" }}
        />
        <Stack.Screen
          name="buy"
          component={RaceSelectionScreen}
          options={{ title: "血統検索" }}
        />
        <Stack.Screen
          name="RaceSelection"
          component={RaceSelectionScreen}
          options={{ title: "レース選択" }}
        />
        <Stack.Screen
          name="betting_type_page"
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
          name="PlaceBet"
          component={PlaceBet}
          options={{ title: "複勝" }}
        />
        <Stack.Screen
          name="trifecta_formation"
          component={TrifectaCombination}
          options={{ title: "三連複フォーメーション" }}
        />
        <Stack.Screen
          name="trifecta_combination"
          component={TrioCombinationScreen}
          options={{ title: "三連複ボックス" }}
        />

        <Stack.Screen
          name="quinellaBeddingType"
          component={QuinellaBeddingType}
          options={{ title: "馬連式別" }}
        />
        <Stack.Screen
          name="exacta_bedding_type"
          component={ExactaBeddingType}
          options={{ title: "馬単式別" }}
        />
        <Stack.Screen
          name="exacta_formation"
          component={ExactaFormationScreen}
          options={{ title: "馬単フォーメーション" }}
        />
        <Stack.Screen
          name="exacta_box"
          component={ExactaBox}
          options={{ title: "馬単フォーメーション" }}
        />
        <Stack.Screen
          name="quinella_single_axis"
          component={QuinellaSingleAxisScreen}
          options={{ title: "馬連１頭軸流し" }}
        />

        <Stack.Screen
          name="quinella_formation_bet"
          component={QuinellaFormationScreen}
          options={{ title: "馬連フォーメーション" }}
        />
        <Stack.Screen
          name="quinella_box"
          component={TrioBoxScreen}
          options={{ title: "馬連ボックス" }}
        />
        <Stack.Screen
          name="quinella_single_axis"
          component={QuinellaSingleAxisScreen}
          options={{ title: "馬連１頭軸流し" }}
        />
        <Stack.Screen
          name="tricast_betting_type"
          component={TricastBeddingType}
          options={{ title: "三連単式別" }}
        />
        <Stack.Screen
          name="tricast_formation"
          component={TricastFormationScreen}
          options={{ title: "三連単フォーメーション" }}
        />
        <Stack.Screen
          name="tricast_combination"
          component={TrioBoxScreen}
          options={{ title: "三連単フォーメーション" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
