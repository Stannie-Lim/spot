import React, { useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import { TextInput } from "react-native";

import { AuthForm } from "./AuthForm";
import { UserContext } from "../context/UserContext";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const RegisterPage = () => {
  const { setUser } = useContext(UserContext);

  const register = async (inputs) => {
    const { data } = await axios.post(
      `${BACKEND_URL}/api/auth/register`,
      inputs
    );

    await AsyncStorage.setItem("token", data);

    const { data: user } = await axios.get(`${BACKEND_URL}/api/auth/me`, {
      headers: { authorization: `Bearer ${data}` },
    });

    setUser(user);
  };

  return (
    <>
      <AuthForm onSubmit={register} />
    </>
  );
};
