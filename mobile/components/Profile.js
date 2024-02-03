import {
  Text,
  Avatar,
  Chip,
  Divider,
  Input,
  SearchBar,
  ListItem,
} from "react-native-elements";
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useContext, useState, useEffect, useRef, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import axios from "axios";
import Autocomplete from "react-native-autocomplete-input";

import { UserContext } from "../context/UserContext";

export const Profile = () => {
  const { user, setUser } = useContext(UserContext);

  const [selectedItem, setSelectedItem] = useState(null);
  const [fetchedTags, setFetchedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [textValue, setTextValue] = useState("");

  const [tags, setTags] = useState([]);

  const dropdownController = useRef(null);

  const searchRef = useRef(null);
  useEffect(() => {
    const getTags = async () => {
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tags?search=${textValue}`
      );

      const tagsData = data
        .filter(({ id }) => !tags.find((tag) => tag.id === id))
        .map(({ id, name }) => ({ id, title: name }));

      if (
        !data.find((tag) => tag.name.toLowerCase() === textValue.toLowerCase())
      ) {
        setFetchedTags([{ id: 0, title: "Create new tag" }, ...tagsData]);
      } else {
        setFetchedTags(tagsData);
      }

      setLoading(false);
    };
    if (textValue.trim().length) {
      getTags();
    } else {
      setFetchedTags([]);
    }
  }, [textValue]);

  const onChangeText = async (text) => {
    setTextValue(text);
  };

  const onSelectItem = async (item) => {
    if (!item) return;

    setFetchedTags([]);
    setTextValue("");

    if (item.id === 0) {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/tags`,
        {
          name: textValue,
        }
      );
      setTags([...tags, { id: data.id, title: data.name }]);
      return;
    }

    setTags([...tags, item]);
  };

  const onClearPress = useCallback(() => {
    setFetchedTags(null);
  }, []);

  const onOpenSuggestionsList = useCallback((isOpened) => {}, []);

  return (
    <View style={styles.container}>
      <Avatar
        size="xlarge"
        rounded
        source={{ uri: user.userImages[0].imageURL }}
      />
      <View style={{ marginBottom: 16 }} />
      <View
        style={{
          maxHeight: 200,
          border: "1px solid black",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          overflowY: "scroll",
        }}
      >
        {tags.map((tag) => (
          <View style={{ marginRight: 8, width: 100, marginBottom: 8 }}>
            <Chip key={tag.id} title={tag.title} />
          </View>
        ))}
      </View>
      <View style={{ width: "100%" }}>
        <Autocomplete
          data={fetchedTags}
          value={textValue}
          onChangeText={onChangeText}
          flatListProps={{
            keyExtractor: (_, idx) => idx,
            renderItem: ({ item }) => (
              <TouchableOpacity onPress={() => onSelectItem(item)}>
                <Text style={{ padding: 8 }}>{item.title}</Text>
                <Divider />
              </TouchableOpacity>
            ),
          }}
        />
        {/* <AutocompleteDropdown
          textInputProps={{
            autoCorrect: false,
            autoCapitalize: "none",
          }}
          controller={(controller) => {
            dropdownController.current = controller;
          }}
          closeOnBlur={false}
          trimSearchText={true}
          ref={searchRef}
          debounce={600}
          onClear={onClearPress}
          onOpenSuggestionsList={onOpenSuggestionsList}
          direction={Platform.select({ ios: "down" })}
          controller={(controller) => {
            dropdownController.current = controller;
          }}
          clearOnFocus={false}
          onChangeText={onChangeText}
          useFilter={false}
          suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
          loading={loading}
          closeOnBlur={true}
          emptyResultText="Start searching"
          closeOnSubmit={false}
          clearOnFocus
          onSelectItem={onSelectItem}
          dataSet={fetchedTags}
        /> */}
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
