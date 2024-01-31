import { useState, useEffect } from "react";
import axios from "axios";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { BottomTabsNavigator } from "./components/BottomTabsNavigator";
import { MainPage } from "./components/MainPage";

import { UserContext } from "./context/UserContext";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const attemptToLogin = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const { data: user } = await axios.get(`${BACKEND_URL}/api/auth/me`, {
          headers: { authorization: `Bearer ${token}` },
        });

        setUser(user);
      }
    };

    attemptToLogin();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <View style={styles.container}>
          {user ? <MainPage /> : <BottomTabsNavigator />}
        </View>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    margin: "2rem 0",
  },
});
