import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, Text, StyleSheet, View } from "react-native";

import { UserContext } from "../context/UserContext";
import { LikeOrNotSwipeContainer } from "./LikeOrNotSwipeContainer";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconButton, MD3Colors } from "react-native-paper";

import { Friends } from "./Friends";
import { Chat } from "./Chat";

const Stack = createNativeStackNavigator();

export const MainPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const { data } = await axios.get(
          "http://localhost:3000/api/users_to_swipe",
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      getData();
    }
  }, [user]);

  const signout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  const Home = ({ navigation }) => {
    const goToFriends = () => {
      navigation.navigate("Friends");
    };

    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <IconButton icon="logout" size={32} onPress={signout} />
          <IconButton icon="account-multiple" size={32} onPress={goToFriends} />
        </View>
        <LikeOrNotSwipeContainer users={users} setUsers={setUsers} />
      </View>
    );
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Friends" component={Friends} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
