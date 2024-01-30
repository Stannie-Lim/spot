import { useState, useCallback, useEffect, useContext } from "react";
import { Text, View, StyleSheet } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

import { UserContext } from "../context/UserContext";
import socket from "./socket";

export const Chat = ({
  route: {
    params: { user: receiver },
  },
}) => {
  const { user: sender } = useContext(UserContext);
  const [sessionID, setSessionID] = useState(null);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("join_room", sender.id);

    socket.on("message", (data) => {
      const message = {
        text: data.message,
        user: {
          _id: data.sender.id,
          name: data.sender.username,
          avatar: data.sender.userImages[0].imageURL,
        },
        createdAt: new Date(),
        _id: data.messageID,
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, message)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const onSend = (messages = []) => {
    socket.emit("message", {
      messageID: messages[0]._id,
      sender,
      receiver,
      message: messages[0].text,
      createdAt: messages[0].createdAt,
    });

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  };

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
