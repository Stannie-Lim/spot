import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar, ListItem } from "react-native-elements";
import axios from "axios";

import { View, FlatList } from "react-native";
import { Text } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const Friends = ({ navigation }) => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const token = await AsyncStorage.getItem("token");

      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/connections`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setFriends(data);
      } catch (error) {
        console.log(error);
      }
    };

    getFriends();
  }, []);

  const getUserItem = ({ item: user }) => {
    const navigateToUser = () => {
      navigation.navigate("Chat", { user });
    };

    return (
      <ListItem bottomDivider onPress={navigateToUser}>
        <Avatar source={{ uri: user.friend.userImages[0].imageURL }} />
        <ListItem.Content>
          <ListItem.Title>{user.friend.username}</ListItem.Title>
        </ListItem.Content>
        <Icon name="chevron-right" color="black" size={26} />
      </ListItem>
    );
  };

  return (
    <View>
      <FlatList
        keyExtractor={(user) => user.friend.id.toString()}
        data={friends}
        renderItem={getUserItem}
      />
    </View>
  );
};
