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
import EventCard from "../components/EventCard";

const EventsScreen = ({ navigation, isEnabled }) => {
  // State voor events uit Webflow
  const [events, setEvents] = useState([]);

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
      fieldData["event-image"] ||
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
    // EVENTS OPHALEN UIT WEBFLOW
    fetch(
      "https://api.webflow.com/v2/sites/6a145e3f272bd80bb3bf3bd7/collections/6a15d5f29f4424ca591ca009/items",
      {
        headers: {
          Authorization:
            "Bearer 698a51cbfdc7ab58ba8f7913b52f2e68750986cd8fc474427c9abd0d48c53e0f",
        },
      },
    )
      .then((res) => res.json())
      .then((data) =>
        setEvents(
          (data.items || []).map((item) => {
            const locationValue =
              item.fieldData.locatie ||
              item.fieldData.location ||
              item.fieldData.campus;

            return {
              id: item.id,

              // Titel van event
              title: item.fieldData.name,

              // Korte beschrijving voor op de card
              description:
                cleanText(item.fieldData["korte-beschrijving"]) ||
                cleanText(item.fieldData.description) ||
                cleanText(item.fieldData.Description) ||
                "Kom langs tijdens dit event.",

              // Volledige tekst voor detailpagina
              body:
                cleanText(item.fieldData.description) ||
                cleanText(item.fieldData.Description) ||
                cleanText(item.fieldData.body),

              // Datum uit Webflow
              // FormatDate zorgt ervoor dat uur/minuten verdwijnen
              date:
                formatDate(item.fieldData.datum) ||
                formatDate(item.fieldData.date) ||
                formatDate(item.fieldData["event-datum"]) ||
                formatDate(item.createdOn),

              // Start- en einduur
              time:
                item.fieldData["start-en-eind-uur"] ||
                item.fieldData["start-eind-uur"] ||
                item.fieldData.uur ||
                "",

              // Locatie, maar geen Webflow ID tonen
              location: isWebflowId(locationValue)
                ? "Busleyden Atheneum"
                : locationValue || "Busleyden Atheneum",

              // Spreker of verantwoordelijke
              speaker:
                item.fieldData.spreker ||
                item.fieldData.Spreker ||
                item.fieldData.verantwoordelijke ||
                "Busleyden Atheneum",

              // Afbeelding
              image: getImage(item.fieldData),

              // Kleur uit Webflow
              accentColor: getColor(item.fieldData),
            };
          }),
        ),
      )
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  // Events filteren op zoekterm
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Titel en korte intro */}
      <Text style={[styles.heading, { color: colors.text }]}>Events</Text>

      <Text style={[styles.subText, { color: colors.subText }]}>
        Bekijk de infomomenten, workshops en rondleidingen van Busleyden
        Atheneum.
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
        placeholder="Zoek een event..."
        placeholderTextColor={colors.subText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Aantal resultaten */}
      <View style={[styles.resultBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.resultText, { color: colors.text }]}>
          {filteredEvents.length} events gevonden
        </Text>
      </View>

      {/* Eventcards tonen */}
      {filteredEvents.map((event) => (
        <EventCard
          key={event.id}
          title={event.title}
          description={event.description}
          date={event.date}
          location={event.location}
          accentColor={event.accentColor}
          onPress={() => navigation.navigate("EventDetail", event)}
          isEnabled={isEnabled}
        />
      ))}

      {/* Tekst als er niets gevonden wordt */}
      {filteredEvents.length === 0 && (
        <Text style={[styles.emptyText, { color: colors.subText }]}>
          Geen events gevonden.
        </Text>
      )}

      {/* Knop naar contact */}
      <Pressable
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate("Contact")}
      >
        <Text style={styles.buttonText}>Contacteer ons</Text>
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

export default EventsScreen;
