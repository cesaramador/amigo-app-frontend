import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";
import { ThemeProvider } from "styled-components/native";
import { Colors } from "../constants/theme";

export default function Index() {

  const [ isDarkTheme, setIsDarkTheme ] = useState(false);
  const router = useRouter();

  const toggleTheme = () => {
    setIsDarkTheme( !isDarkTheme );
  }
  const currenTheme = isDarkTheme ? Colors.dark : Colors.light;

  return (

    // usando ThemeProvider y Colors desde constants/theme.ts
    <ThemeProvider theme={currenTheme}>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 30, color: "green" }}>Home - Index</Text>
        <br />
        <Button title="Go to ABOUT" onPress={() => router.push("/about")} />
          <br />
        <Button title="Cambiar tema" onPress={ toggleTheme } />
      </View>

    </ThemeProvider>
  );
}

