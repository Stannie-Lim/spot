import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, Avatar, Button } from "react-native-elements";

import { UserContext } from "../context/UserContext";
import { LikeOrNotSwipeContainer } from "./LikeOrNotSwipeContainer";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconButton, MD3Colors } from "react-native-paper";

import { Friends } from "./Friends";
import { Chat } from "./Chat";
import { Profile } from "./Profile";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const Stack = createNativeStackNavigator();

export const MainPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        const { data } = await axios.get(`${BACKEND_URL}/api/users_to_swipe`, {
          headers: { authorization: `Bearer ${token}` },
        });

        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      getData();
    }
  }, [user]);

  const Home = ({ navigation }) => {
    const goToFriends = () => {
      navigation.navigate("Friends");
    };

    const goToProfile = () => {
      navigation.navigate("Profile");
    };

    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Avatar
            rounded
            source={{ uri: user.userImages[0].imageURL }}
            onPress={goToProfile}
          />
          <IconButton icon="account-multiple" size={32} onPress={goToFriends} />
        </View>
        <LikeOrNotSwipeContainer
          users={users}
          setUsers={setUsers}
          navigation={navigation}
        />
      </View>
    );
  };

  const signout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Friends" component={Friends} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerRight: () => (
            <IconButton icon="logout" size={24} onPress={signout} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 8,
    width: "100%",
  },
});
