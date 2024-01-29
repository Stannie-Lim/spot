import React, { useState, useContext } from "react";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import { AuthForm } from "./AuthForm";
import { UserContext } from "../context/UserContext";

export const LoginPage = () => {
  const { setUser } = useContext(UserContext);

  const login = async (inputs) => {
    console.log(inputs);
    const { data } = await axios.post(
      "http://localhost:3000/api/auth/login",
      inputs
    );

    await AsyncStorage.setItem("token", data);

    const { data: user } = await axios.get(
      "http://localhost:3000/api/auth/me",
      {
        headers: { authorization: `Bearer ${data}` },
      }
    );

    setUser(user);
  };

  return (
    <>
      <AuthForm onSubmit={login} isLogin={true} />
    </>
  );
};
