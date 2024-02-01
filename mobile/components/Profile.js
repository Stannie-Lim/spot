import { Text, Avatar, Chip, Input, SearchBar } from "react-native-elements";
import { View, StyleSheet } from "react-native";
import { useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import axios from "axios";

import { UserContext } from "../context/UserContext";

export const Profile = () => {
  const { user, setUser } = useContext(UserContext);

  const [selectedItem, setSelectedItem] = useState(null);
  const [fetchedTags, setFetchedTags] = useState([
    { id: 0, title: "Create new tag" },
  ]);
  const [loading, setLoading] = useState(false);

  const signout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
  };

  const onChangeText = async (text) => {
    setLoading(true);

    const { data } = await axios.get(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tags?search=${text}`
    );

    setFetchedTags([{ id: 0, title: "Create new tag" }, ...data]);

    setLoading(false);
  };

  const onSelectItem = async (item) => {
    if (item.id === 0) {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tags`,
        {
          name: item.title,
        }
      );

      return;
    }

    setSelectedItem(item);
  };

  return (
    <View style={styles.container}>
      <Avatar
        size="xlarge"
        rounded
        source={{ uri: user.userImages[0].imageURL }}
      />
      <View style={{ marginBottom: 16 }} />
      <View style={{ width: "100%" }}>
        <AutocompleteDropdown
          clearOnFocus={false}
          onChangeText={onChangeText}
          useFilter={false}
          loading={loading}
          closeOnBlur={true}
          closeOnSubmit={false}
          onSelectItem={onSelectItem}
          dataSet={fetchedTags}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    flexDirection: "column",
  },
});
