import React, { useState, useContext } from "react";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import { AuthForm } from "./AuthForm";
import { UserContext } from "../context/UserContext";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const LoginPage = () => {
  const { setUser } = useContext(UserContext);

  const login = async (inputs) => {
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        inputs
      );

      await AsyncStorage.setItem("token", data);

      const { data: user } = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        headers: { authorization: `Bearer ${data}` },
      });

      setUser(user);
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  return (
    <>
      <AuthForm onSubmit={login} isLogin={true} />
    </>
  );
};
