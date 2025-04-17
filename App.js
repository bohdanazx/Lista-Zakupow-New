// App.js
import React from "react";
// Це головний контейнер, який відповідає за всю навігацію в додатку. Це як рамка або обгортка, яка дозволяє переходити між екранами в нашому мобільному додатку.
import { NavigationContainer } from "@react-navigation/native";
// Це тип навігації, де екрани накладаються один на інший, як карти (stack = стек).
// Уявіть, що кожен екран — це сторінка. Ми «штовхаємо» нову сторінку зверху і можемо «повернутись назад». Це зручно для мобільних додатків.
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import AddProductScreen from "./screens/AddProductScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";

// Сам навігатор. Stack — це змінна, в якій зберігається об'єкт для керування переходами між екранами. Створити навігаційну структуру, в якій кожен екран додається у вигляді стеку.
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddProduct" component={AddProductScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
