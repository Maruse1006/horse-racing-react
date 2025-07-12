import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";

// AuthContext を追加
import { AuthContext } from "../src/context/AuthContext";

// 画面コンポーネントのインポート
import Register from "../app/register";
import Dashboard from "../app/dashboard";
import Home from "../app/home";
import LoginScreen from "../app/login";
import Blood from "../app/blood/index";
import RaceSelectionScreen from "../app/buy/index";
import WinBet from "../app/winBet";
import PlaceBet from "../app/placeBet";
import TrifectaBeddingType from "../app/trifecta/trifectaBeddingType";
import ExactaBeddingType from "../app/exacta_betting_type";
import ExactaFormation from "../app/exacta_formation";
import WideQuinellaBettingType from "../app/wideQuinellaBettingType";
import TrioSecondKeyScreen from "../app/trifectaSecondKey";
import TrioThirdKeyScreen from "../app/trifectaThirdKey";
import TrioFirstKeyScreen from "../app/trifectaFirstkey";
import TrioBoxScreen from "../app/quinella_box";
import TricastFormation from "../app/tricastFormation";
import TricastBeddingType from "../app/tricastBettingType";
import QuinellaSingleAxisScreen from "../app/quinella_single_axis";
import TrifectaBettingType from "../app/trifectaBettingType";
import QuinellaFormationScreen from "../app/quinella_formation_bet";
import ExactaBox from "../app/exacta_box";
import ExactaFormationScreen from "../app/exacta_formation";
import QuinellaBeddingType from "../app/quinellaBeddingType";
import BettingOptionsScreen from "../app/betting_type_page";
import WideQuinellaBox from "../app/wideQuinellaBox";
import WideQuinellaFormation from "../app/wideQuinellaFormation";
import QuinellaFormation from "../app/quinella_formation_bet";
import TrifectFormation from "../app/trifectaFormation";
import ExactaSingleAxisScreen from "../app/exacta_single_axis";
import TricastBox from "../app/trifectaCombination";
import TrifectBox from "../app/trifectaCombination";
import GradeCourseAnalysis from "../app/grade-course-analysis";
import GradeRaceDetail from "../app/grade-course-analysis/detail";


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// ログイン後の画面
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Blood" component={Blood} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RaceSelection" component={RaceSelectionScreen} />
      <Stack.Screen name="GradeCourseAnalysis" component={GradeCourseAnalysis} />
      <Stack.Screen name="GradeRaceDetail" component={GradeRaceDetail} />
      <Stack.Screen name="WinBet" component={WinBet} />
      <Stack.Screen name="PlaceBet" component={PlaceBet} />
      <Stack.Screen name="TrifectaBeddingType" component={TrifectaBeddingType} />
      <Stack.Screen name="ExactaBeddingType" component={ExactaBeddingType} />
      <Stack.Screen name="WideQuinella" component={WideQuinellaBettingType} />
      <Stack.Screen name="WideQuinellaBox" component={WideQuinellaBox} />
      <Stack.Screen name="WideQuinellaFormation" component={WideQuinellaFormation} />
      <Stack.Screen name="TrioSecondKey" component={TrioSecondKeyScreen} />
      <Stack.Screen name="TrioThirdKey" component={TrioThirdKeyScreen} />
      <Stack.Screen name="TrioFirstKey" component={TrioFirstKeyScreen} />
      <Stack.Screen name="TricastBox" component={TricastBox} />
      <Stack.Screen name="TricastBetting" component={TricastBeddingType} />
      <Stack.Screen name="TricastFormation" component={TricastFormation} />
      <Stack.Screen name="QuinellaSingleAxis" component={QuinellaSingleAxisScreen} />
      <Stack.Screen name="TrifectaBettingType" component={TrifectaBettingType} />
      <Stack.Screen name="TrifectFormation" component={TrifectFormation} />
      <Stack.Screen name="TrifectBox" component={TrifectBox} />
      <Stack.Screen name="ExactaFormation" component={ExactaFormationScreen} />
      <Stack.Screen name="ExactaBox" component={ExactaBox} />
      <Stack.Screen name="ExactaSingleAxisScreen" component={ExactaSingleAxisScreen} />
      <Stack.Screen name="QuinellaBeddingType" component={QuinellaBeddingType} />
      <Stack.Screen name="QuinellaFormation" component={QuinellaFormation} />
      <Stack.Screen name="betting_type_page" component={BettingOptionsScreen} />
    </Stack.Navigator>
  );
}

// ログイン後の Drawer
function LoggedInDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        drawerType: "slide",
        drawerStyle: {
          width: 240,
          backgroundColor: "#fff",
        },
        headerTitleAlign: "center",
        headerTitle: "horse",
        headerTitleStyle: { fontSize: 18, fontWeight: "bold" },
      }}
    >
      <Drawer.Screen name="MainStack" component={MainStack} options={{ title: "メインメニュー" }} />
      <Drawer.Screen name="Home" component={Home} options={{ title: "ホーム" }} />
      <Drawer.Screen name="Dashboard" component={Dashboard} options={{ title: "ダッシュボード" }} />
    </Drawer.Navigator>
  );
}

// 未ログイン時
function AuthDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerType: "slide",
        drawerStyle: {
          width: 240,
          backgroundColor: "#fff",
        },
        headerTitleAlign: "center",
        headerTitle: "horse",
        headerTitleStyle: { fontSize: 18, fontWeight: "bold" },
      }}
    >
      <Drawer.Screen name="Login" component={LoginScreen} options={{ title: "ログイン" }} />
      <Drawer.Screen name="Register" component={Register} options={{ title: "登録" }} />
    </Drawer.Navigator>
  );
}

// エントリーポイント
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // login / logout 関数
  const login = () => setIsLoggedIn(true);
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // 起動時トークン確認
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    checkToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ login, logout }}>
      <NavigationContainer>
        {isLoggedIn ? <LoggedInDrawer /> : <AuthDrawer />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
