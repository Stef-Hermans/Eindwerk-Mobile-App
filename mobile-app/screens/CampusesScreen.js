import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import CampusCard from "../components/CampusCard";

const CampusesScreen = ({ navigation, isEnabled }) => {
  // State voor campussen uit Webflow
  const [campuses, setCampuses] = useState([]);

  // State voor zoekfunctie
  const [searchQuery, setSearchQuery] = useState("");

  // Standaardkleur van de website
  const defaultGreen = "#86bc25";

  // Kleuren voor light mode en dark mode
  const colors = isEnabled
    ? {
        background: "#111827",
        card: "#1f2937",
        text: "#f9fafb",
        subText: "#d1d5db",
        border: "#374151",
        inputBackground: "#1f2937",
        accent: defaultGreen,
      }
    : {
        background: "#f5f7fb",
        card: "#ffffff",
        text: "#111827",
        subText: "#6b7280",
        border: "#d1d5db",
        inputBackground: "#ffffff",
        accent: defaultGreen,
      };

  // HTML tags verwijderen uit Webflow rich text
  const cleanText = (text) => {
    if (!text) return "";

    return String(text)
      .replace(/<\/p>/g, "\n\n")
      .replace(/<\/h1>/g, "\n\n")
      .replace(/<\/h2>/g, "\n\n")
      .replace(/<\/h3>/g, "\n\n")
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  };

  // Afbeelding zoeken in verschillende mogelijke Webflow velden
  const getImage = (fieldData) => {
    const image =
      fieldData.image ||
      fieldData.Image ||
      fieldData.afbeelding ||
      fieldData.Afbeelding ||
      fieldData["main-image"] ||
      fieldData["campus-image"] ||
      fieldData["campus-afbeelding"] ||
      fieldData["afbeelding-campus"] ||
      fieldData["hoofdafbeelding"];

    if (image?.url) {
      return { uri: image.url };
    }

    return null;
  };

  // Kleur zoeken in Webflow
  const getColor = (fieldData) => {
    return (
      fieldData.kleur ||
      fieldData.Kleur ||
      fieldData.color ||
      fieldData.Color ||
      defaultGreen
    );
  };

  useEffect(() => {
    // CAMPUSSEN OPHALEN UIT WEBFLOW
    fetch(
      "https://api.webflow.com/v2/sites/6a145e3f272bd80bb3bf3bd7/collections/6a15e32ecd71eefc575a7215/items",
      {
        headers: {
          Authorization:
            "Bearer f24bd791bf8521d74cc19a322de75ba5d59a0d39b3ffc08426f177f7cb87c262",
        },
      },
    )
      .then((res) => res.json())
      .then((data) =>
        setCampuses(
          (data.items || []).map((item) => ({
            id: item.id,

            // Naam van campus
            title: item.fieldData.name,

            // Korte tekst voor op de card
            description:
              cleanText(item.fieldData["korte-beschrijving"]) ||
              "Ontdek deze campus van Busleyden Atheneum.",

            // Volledige tekst voor detailpagina
            body:
              cleanText(item.fieldData["volledige-uitleg-campus"]) ||
              cleanText(item.fieldData.description) ||
              cleanText(item.fieldData.body),

            // Afbeelding van campus
            image: getImage(item.fieldData),

            // Kleur van campus uit Webflow
            accentColor: getColor(item.fieldData),

            // Extra info voor detailpagina
            address:
              item.fieldData.adres ||
              item.fieldData.address ||
              "Zandpoortvest 60, 2800 Mechelen",

            email: item.fieldData.email || "info@campus.be",
          })),
        ),
      )
      .catch((error) => console.error("Error fetching campussen:", error));
  }, []);

  // Campussen filteren op zoekterm
  const filteredCampuses = campuses.filter((campus) =>
    campus.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Titel en korte intro */}
      <Text style={[styles.heading, { color: colors.text }]}>Campussen</Text>

      <Text style={[styles.subText, { color: colors.subText }]}>
        Ontdek de verschillende campussen van Busleyden Atheneum.
      </Text>

      {/* Zoekfunctie */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Zoek een campus..."
        placeholderTextColor={colors.subText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Aantal resultaten */}
      <View style={[styles.resultBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.resultText, { color: colors.text }]}>
          {filteredCampuses.length} campussen gevonden
        </Text>
      </View>

      {/* Campuscards tonen */}
      {filteredCampuses.map((campus) => (
        <CampusCard
          key={campus.id}
          title={campus.title}
          description={campus.description}
          image={campus.image}
          accentColor={campus.accentColor}
          onPress={() => navigation.navigate("CampusDetail", campus)}
          isEnabled={isEnabled}
        />
      ))}

      {/* Tekst als er niets gevonden wordt */}
      {filteredCampuses.length === 0 && (
        <Text style={[styles.emptyText, { color: colors.subText }]}>
          Geen campussen gevonden.
        </Text>
      )}

      {/* Knop naar opleidingen */}
      <Pressable
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate("Opleidingen")}
      >
        <Text style={styles.buttonText}>Bekijk opleidingen</Text>
      </Pressable>

      {/* StatusBar aanpassen aan dark mode */}
      <StatusBar style={isEnabled ? "light" : "dark"} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Algemene container
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },

  // Grote titel bovenaan
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  // Korte beschrijving onder de titel
  subText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },

  // Zoekbalk
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
    borderRadius: 12,
  },

  // Box rond aantal resultaten
  resultBox: {
    width: "100%",
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },

  // Tekst aantal resultaten
  resultText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Tekst als er geen resultaten zijn
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
  },

  // Groene knop onderaan
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  // Tekst in knop
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CampusesScreen;
