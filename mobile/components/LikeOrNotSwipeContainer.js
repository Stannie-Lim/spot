import React, { useMemo, useState } from "react";
import { Image, StyleSheet, View, Pressable } from "react-native";
import { Text } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconButton, MD3Colors } from "react-native-paper";

import axios from "axios";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const LikeOrNotSwipeContainer = ({ users, setUsers, navigation }) => {
  const [index, setIndex] = useState(0);
  const [isMatch, setIsMatch] = useState(false);

  const user = useMemo(() => users[index], [users, index]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No more users around you</Text>
      </View>
    );
  }

  const onReject = () => {
    setIndex(index + 1);
  };

  const onFriend = async () => {
    const token = await AsyncStorage.getItem("token");
    const { data: status } = await axios.post(
      `${BACKEND_URL}/api/connections`,
      {
        toUserID: user.id,
      },
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (status.message === "MUTUAL") {
      setIsMatch(true);
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <View style={styles.container}>
      {isMatch ? (
        <View style={styles.match}>
          <Text style={styles.match}>You're a match!</Text>
          <Image
            style={styles.image}
            source={{ uri: user.userImages[0]?.imageURL }}
          />
          <View style={styles.buttons}>
            <Pressable onPress={() => setIsMatch(false)}>
              <Text
                style={styles.fontsize}
                onPress={() => {
                  setIsMatch(false);
                  setIndex(index + 1);
                }}
              >
                Continue swiping
              </Text>
            </Pressable>
            <Pressable onPress={() => setIsMatch(false)}>
              <Text
                style={styles.fontsize}
                onPress={() => {
                  setIsMatch(false);
                  navigation.navigate("Chat", { user });
                }}
              >
                Chat
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.name}>{user.username}</Text>
          <Image
            style={styles.image}
            source={{ uri: user.userImages[0]?.imageURL }}
          />
          <View style={styles.buttons}>
            <IconButton
              icon="close-thick"
              iconColor={MD3Colors.error50}
              size={48}
              onPress={onReject}
            />
            <IconButton
              icon="check-bold"
              iconColor="green"
              size={48}
              onPress={onFriend}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 500,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: 500,
    fontSize: 24,
    textAlign: "center",
  },
  match: {
    fontSize: 48,
  },
  fontsize: {
    fontSize: 16,
  },
});
