import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";

import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

export const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Login"
        component={LoginPage}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="login" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Register"
        component={RegisterPage}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="person" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
