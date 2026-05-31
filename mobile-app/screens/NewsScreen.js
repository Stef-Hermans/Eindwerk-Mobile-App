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
import NewsCard from "../components/NewsCard";

const NewsScreen = ({ navigation, isEnabled }) => {
  // State voor nieuws uit Webflow
  const [news, setNews] = useState([]);

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

  // Datum mooier maken naar dag/maand/jaar
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("nl-BE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Afbeelding zoeken in verschillende mogelijke Webflow velden
  const getImage = (fieldData) => {
    const image =
      fieldData.afbeelding ||
      fieldData.Afbeelding ||
      fieldData.image ||
      fieldData.Image ||
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
      fieldData.kleur ||
      fieldData.Kleur ||
      fieldData.color ||
      fieldData.Color ||
      defaultGreen
    );
  };

  useEffect(() => {
    // NIEUWS OPHALEN UIT WEBFLOW
    fetch(
      "https://api.webflow.com/v2/sites/6a145e3f272bd80bb3bf3bd7/collections/6a19fff5ae9607a1996d2707/items",
      {
        headers: {
          Authorization:
            "Bearer 1576a8b1a009c6710ee81292dcc5df6657d82627753fdc3a34e52464c66356f7",
        },
      },
    )
      .then((res) => res.json())
      .then((data) =>
        setNews(
          (data.items || []).map((item) => ({
            id: item.id,

            // Titel van nieuwsbericht
            title: item.fieldData.name,

            // Korte tekst voor op de card
            description:
              cleanText(item.fieldData["korte-beschrijving"]) ||
              cleanText(item.fieldData.samenvatting) ||
              cleanText(item.fieldData.summary) ||
              "Lees meer over dit nieuwsbericht.",

            // Volledige tekst voor detailpagina
            body:
              cleanText(item.fieldData["uitgebreide-tekst"]) ||
              cleanText(item.fieldData["volledige-tekst"]) ||
              cleanText(item.fieldData.description) ||
              cleanText(item.fieldData.body),

            // Datum uit Webflow of publicatiedatum
            date:
              formatDate(item.fieldData.datum) ||
              formatDate(item.fieldData.date) ||
              formatDate(item.lastPublished) ||
              formatDate(item.createdOn),

            // Afbeelding van nieuws
            image: getImage(item.fieldData),

            // Kleur uit Webflow
            accentColor: getColor(item.fieldData),
          })),
        ),
      )
      .catch((error) => console.error("Error fetching nieuws:", error));
  }, []);

  // Nieuws filteren op zoekterm
  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Titel en korte intro */}
      <Text style={[styles.heading, { color: colors.text }]}>Nieuws</Text>

      <Text style={[styles.subText, { color: colors.subText }]}>
        Blijf op de hoogte van het laatste nieuws van Busleyden Atheneum.
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
        placeholder="Zoek een nieuwsbericht..."
        placeholderTextColor={colors.subText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Aantal resultaten */}
      <View style={[styles.resultBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.resultText, { color: colors.text }]}>
          {filteredNews.length} nieuwsberichten gevonden
        </Text>
      </View>

      {/* Nieuwscards tonen */}
      {filteredNews.map((item) => (
        <NewsCard
          key={item.id}
          title={item.title}
          description={item.description}
          date={item.date}
          image={item.image}
          accentColor={item.accentColor}
          onPress={() => navigation.navigate("NewsDetail", item)}
          isEnabled={isEnabled}
        />
      ))}

      {/* Tekst als er niets gevonden wordt */}
      {filteredNews.length === 0 && (
        <Text style={[styles.emptyText, { color: colors.subText }]}>
          Geen nieuwsberichten gevonden.
        </Text>
      )}

      {/* Knop naar events */}
      <Pressable
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate("Events")}
      >
        <Text style={styles.buttonText}>Bekijk events</Text>
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

export default NewsScreen;
