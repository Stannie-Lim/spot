import React, { useState } from "react";

import { TextInput, View, StyleSheet } from "react-native";
import { Input } from "react-native-elements";
import { Button } from "react-native-elements";

export const AuthForm = ({ onSubmit, isLogin }) => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  return (
    <View style={styles.container}>
      <Input
        autoCapitalize="none"
        placeholder="Username"
        autoCorrect={false}
        value={inputs.username}
        onChangeText={(value) => {
          setInputs({ ...inputs, username: value });
        }}
      />
      <Input
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Password"
        value={inputs.password}
        onChangeText={(value) => setInputs({ ...inputs, password: value })}
      />
      <Button
        onPress={() => onSubmit(inputs)}
        title={isLogin ? "Log In" : "Sign Up"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});
