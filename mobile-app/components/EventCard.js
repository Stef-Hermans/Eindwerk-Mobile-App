import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const EventCard = ({
  title,
  description,
  date,
  location,
  onPress,
  accentColor = "#86bc25",
  isEnabled,
}) => {
  // Kleurenset van de eventcard voor light mode / dark mode
  const colors = isEnabled
    ? {
        card: "#1f2937",
        text: "#f9fafb",
        subText: "#d1d5db",
        accent: accentColor,
        dateBox: "#111827",
      }
    : {
        card: "#fff",
        text: "#111827",
        subText: "#6b7280",
        accent: accentColor,
        dateBox: "#f5f7fb",
      };

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* Datumblok */}
      <View style={[styles.dateBox, { backgroundColor: colors.dateBox }]}>
        <Text style={[styles.dateText, { color: colors.accent }]}>
          {date || "Datum onbekend"}
        </Text>
      </View>

      {/* Kleine labeltekst */}
      <Text style={[styles.category, { color: colors.subText }]}>Event</Text>

      {/* Titel, locatie en beschrijving */}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {location ? (
        <Text style={[styles.location, { color: colors.accent }]}>
          {location}
        </Text>
      ) : null}

      <Text style={[styles.description, { color: colors.subText }]}>
        {description}
      </Text>

      {/* Knop naar details */}
      <Pressable style={[styles.button]} onPress={onPress}>
        <Text style={styles.buttonText}>Bekijk event</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  // Hele eventcard
  card: {
    width: 320,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  // Box rond datum
  dateBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },

  // Datumtekst
  dateText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Kleine label boven titel
  category: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  // Eventtitel
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  // Locatie
  location: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },

  // Beschrijving
  description: {
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 20,
  },

  // Groene knop
  button: {
    backgroundColor: "#86bc25",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  // Tekst in knop
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default EventCard;
