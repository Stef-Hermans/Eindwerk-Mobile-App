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
import ProgramCard from "../components/ProgramCard";

const ProgramsScreen = ({ navigation, isEnabled }) => {
  // State voor opleidingen uit Webflow
  const [programs, setPrograms] = useState([]);

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

  // Controleren of iets een Webflow reference ID is
  const isWebflowId = (value) => {
    if (!value) return false;
    return String(value).length > 15 && String(value).startsWith("6a");
  };

  // Afbeelding zoeken in verschillende mogelijke Webflow velden
  const getImage = (fieldData) => {
    const image =
      fieldData.image ||
      fieldData.Image ||
      fieldData.afbeelding ||
      fieldData.Afbeelding ||
      fieldData["main-image"] ||
      fieldData["hoofdafbeelding"];

    if (image?.url) {
      return { uri: image.url };
    }

    return null;
  };

  // Kleur zoeken in Webflow
  const getColor = (fieldData) => {
    return (
      fieldData.color ||
      fieldData.Color ||
      fieldData.kleur ||
      fieldData.Kleur ||
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
      .then((campusData) => {
        // Eerst maken we een lijst van alle campussen
        const campusList = (campusData.items || []).map((item) => ({
          id: item.id,
          title: item.fieldData.name,
          accentColor: getColor(item.fieldData),
        }));

        // OPLEIDINGEN OPHALEN UIT WEBFLOW
        fetch(
          "https://api.webflow.com/v2/sites/6a145e3f272bd80bb3bf3bd7/collections/6a15e871a69c876374767dc9/items",
          {
            headers: {
              Authorization:
                "Bearer 938cca162f2d846aaea143770e488ce333e0a9052c910633e46949035e1a470a",
            },
          },
        )
          .then((res) => res.json())
          .then((programData) =>
            setPrograms(
              (programData.items || []).map((item) => {
                const campusValue =
                  item.fieldData["campus-2"] ||
                  item.fieldData.campus ||
                  item.fieldData["campus-naam"] ||
                  item.fieldData.locatie;

                const campusItem = campusList.find(
                  (campus) => campus.id === campusValue,
                );

                return {
                  id: item.id,

                  // Naam van opleiding
                  title: item.fieldData.name,

                  // Tag van opleiding
                  tag: item.fieldData.tag || "Opleiding",

                  // Korte beschrijving voor op de card
                  description:
                    cleanText(item.fieldData["korte-beschrijving"]) ||
                    "Ontdek deze opleiding bij Busleyden Atheneum.",

                  // Teksten voor detailpagina
                  intro:
                    cleanText(item.fieldData["beschrijving"]) ||
                    "Meer informatie over deze richting volgt binnenkort.",

                  learning:
                    cleanText(item.fieldData["wat-leer-je"]) ||
                    "Meer informatie over wat je leert volgt binnenkort.",

                  future:
                    cleanText(item.fieldData["toekomstmogelijkheden"]) ||
                    "Meer informatie over toekomstmogelijkheden volgt binnenkort.",

                  body:
                    cleanText(item.fieldData["beschrijving"]) ||
                    cleanText(item.fieldData["wat-leer-je"]) ||
                    cleanText(item.fieldData["toekomstmogelijkheden"]),

                  // Campusnaam van gekoppelde campus
                  campus: campusItem
                    ? campusItem.title
                    : isWebflowId(campusValue)
                      ? "Busleyden Atheneum"
                      : campusValue || "Busleyden Atheneum",

                  // Afbeelding van opleiding
                  image: getImage(item.fieldData),

                  // Kleur van gekoppelde campus
                  accentColor: campusItem
                    ? campusItem.accentColor
                    : getColor(item.fieldData),
                };
              }),
            ),
          )
          .catch((error) =>
            console.error("Error fetching opleidingen:", error),
          );
      })
      .catch((error) => console.error("Error fetching campussen:", error));
  }, []);

  // Opleidingen filteren op zoekterm
  const filteredPrograms = programs.filter(
    (program) =>
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Titel en korte intro */}
      <Text style={[styles.heading, { color: colors.text }]}>Opleidingen</Text>

      <Text style={[styles.subText, { color: colors.subText }]}>
        Ontdek welke richting past bij jouw talenten en interesses.
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
        placeholder="Zoek een opleiding..."
        placeholderTextColor={colors.subText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Aantal resultaten */}
      <View style={[styles.resultBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.resultText, { color: colors.text }]}>
          {filteredPrograms.length} opleidingen gevonden
        </Text>
      </View>

      {/* Opleidingcards tonen */}
      {filteredPrograms.map((program) => (
        <ProgramCard
          key={program.id}
          title={program.title}
          description={program.description}
          campus={program.campus}
          image={program.image}
          accentColor={program.accentColor}
          onPress={() => navigation.navigate("ProgramDetail", program)}
          isEnabled={isEnabled}
        />
      ))}

      {/* Tekst als er niets gevonden wordt */}
      {filteredPrograms.length === 0 && (
        <Text style={[styles.emptyText, { color: colors.subText }]}>
          Geen opleidingen gevonden.
        </Text>
      )}

      {/* Knop naar campussen */}
      <Pressable
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate("Campussen")}
      >
        <Text style={styles.buttonText}>Bekijk campussen</Text>
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

export default ProgramsScreen;
