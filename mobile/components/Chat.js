import { useState, useCallback, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-elements";
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
    socket.connect();

    socket.emit("join_room", {
      senderID: sender.id,
      receiverID: receiver.friend.id,
    });

    socket.on("all_messages", (messages) => {
      setMessages(
        messages.map((message) => ({
          text: message.msg,
          user: {
            _id: message.fromUser.id,
            name: message.fromUser.username,
            avatar: message.fromUser.userImages[0].imageURL,
          },
          createdAt: message.sentAt,
          _id: message.id,
        }))
      );
    });

    socket.on("message", (data) => {
      const message = {
        text: data.message,
        user: {
          _id: data.sender.id,
          name: data.sender.username,
          avatar: data.sender.userImages[0].imageURL,
        },
        createdAt: new Date(),
        _id: data.id,
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
      sender,
      receiver,
      message: messages[0].text,
      createdAt: messages[0].createdAt,
      id: messages[0]._id,
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
    height: "98%",
    width: "100%",
  },
});
