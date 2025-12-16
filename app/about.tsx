import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import { Colors } from "../constants/theme";

export default function About() {
  const router = useRouter();

  return (

    // usando ThemeProvider y Colors desde constants/theme.ts
    <ThemeProvider theme={Colors.dark}>
      
      {/* // trabajando con style enbebido */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", borderColor: 'yellow', borderWidth: 6, backgroundColor: 'black' }}>

        {/* trabajando con StyleSheet */}
        <Text style={styles.text}>About</Text>

        {/* trabajando con styled-components */}
        <Title>About</Title>

        
        <Button title="Go to HOME" onPress={() => router.back()} />

      </View>
    </ThemeProvider>
  );
}

const Title = styled.Text`
  font-size: 30px;
  color: red;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 30,
    color: "blue",
    marginTop: 15,
    paddingVertical: 15,
  },
});