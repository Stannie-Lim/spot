import { useState, useCallback, useEffect, useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

import { UserContext } from "../context/UserContext";

export const Chat = ({
  route: {
    params: { user: receiver },
  },
}) => {
  const { user: sender } = useContext(UserContext);

  const [messages, setMessages] = useState([]);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <View>
      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: sender.id,
            name: sender.username,
            avatar: sender.userImages[0].imageURL,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    border: "1px solid black",
    height: "90%",
    width: "100%",
  },
});
