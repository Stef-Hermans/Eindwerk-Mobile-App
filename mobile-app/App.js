// useState gebruiken we hier om dark mode globaal te bewaren
import { useState } from "react";

// Navigatie imports
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Schermen importeren
import HomeScreen from "./screens/HomeScreen";
import CampusesScreen from "./screens/CampusesScreen";
import CampusDetail from "./screens/CampusDetail";
import ProgramsScreen from "./screens/ProgramsScreen";
import ProgramDetail from "./screens/ProgramDetail";
import NewsScreen from "./screens/NewsScreen";
import NewsDetail from "./screens/NewsDetail";
import EventsScreen from "./screens/EventsScreen";
import EventDetail from "./screens/EventDetail";
import WebshopScreen from "./screens/WebshopScreen";
import ProductDetail from "./screens/ProductDetail";
import ContactScreen from "./screens/ContactScreen";
import GameScreen from "./screens/GameScreen";

// Stack navigator aanmaken
const Stack = createNativeStackNavigator();

export default function App() {
  // Globale dark mode state
  // Deze state wordt doorgestuurd naar alle schermen
  const [isEnabled, setIsEnabled] = useState(false);

  // Kleuren voor de navigatiebalk
  const colors = isEnabled
    ? {
        header: "#111827",
        text: "#f9fafb",
      }
    : {
        header: "#ffffff",
        text: "#111827",
      };

  return (
    // NavigationContainer is de hoofdcontainer voor alle navigatie
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.header,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        {/* Home scherm */}
        {/* Hier geven we isEnabled en setIsEnabled door */}
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              isEnabled={isEnabled}
              setIsEnabled={setIsEnabled}
            />
          )}
        </Stack.Screen>

        {/* Campussen overzicht */}
        <Stack.Screen name="Campussen">
          {(props) => <CampusesScreen {...props} isEnabled={isEnabled} />}
        </Stack.Screen>

        {/* Campus detail */}
        <Stack.Screen name="CampusDetail" options={{ title: "Campus details" }}>
          {(props) => <CampusDetail {...props} isEnabled={isEnabled} />}
        </Stack.Screen>

        {/* Opleidingen overzicht */}
        <Stack.Screen name="Opleidingen">
          {(props) => <ProgramsScreen {...props} isEnabled={isEnabled} />}
        </Stack.Screen>

        {/* Opleiding detail */}
        <Stack.Screen
          name="ProgramDetail"
          options={{ title: "Opleiding details" }}
        >
          {(props) => <ProgramDetail {...props} isEnabled={isEnabled} />}
        </Stack.Screen>

        {/* Nieuws overzicht */}
        <Stack.Screen name="Nieuws">
          {(props) => <NewsScreen {...props} isEnabled={isEnabled} />}
        </Stack.Screen>

        {/* Nieuws detail */}
        <Stack.Screen name="NewsDetail" options={{ title: "Nieuws details" }}>
          {(props) => <NewsDetail {...props} isEnabled={isEnabled} />}
        </Stack.Screen>

        {/* Events overzicht */}
        <Stack.Screen name="Events">
          {(props) => <EventsScreen {...props} isEnabled={isEnabled} />}
        </Stack.Screen>

        {/* Event detail */}
        <Stack.Screen name="EventDetail" options={{ title: "Event details" }}>
          {(props) => <EventDetail {...props} isEnabled={isEnabled} />}
        </Stack.Screen>

        {/* Webshop overzicht */}
        <Stack.Screen name="Webshop">
          {(props) => <WebshopScreen {...props} isEnabled={isEnabled} />}
        </Stack.Screen>

        {/* Product detail */}
        <Stack.Screen
          name="ProductDetail"
          options={{ title: "Product details" }}
        >
          {(props) => <ProductDetail {...props} isEnabled={isEnabled} />}
        </Stack.Screen>

        {/* Contact scherm */}
        <Stack.Screen name="Contact">
          {(props) => <ContactScreen {...props} isEnabled={isEnabled} />}
        </Stack.Screen>

        {/* Game scherm */}
        <Stack.Screen name="Game">
          {(props) => <GameScreen {...props} isEnabled={isEnabled} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
