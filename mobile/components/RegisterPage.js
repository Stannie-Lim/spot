import React, { useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import { TextInput } from "react-native";

import { AuthForm } from "./AuthForm";
import { UserContext } from "../context/UserContext";

export const RegisterPage = () => {
  const { setUser } = useContext(UserContext);

  const register = async (inputs) => {
    const { data } = await axios.post(
      "http://localhost:3000/api/auth/register",
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
      <AuthForm onSubmit={register} />
    </>
  );
};
