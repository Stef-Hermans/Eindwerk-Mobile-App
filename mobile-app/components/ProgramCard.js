import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

const ProgramCard = ({
  title,
  description,
  campus,
  image,
  onPress,
  isEnabled,
}) => {
  // Kleurenset van de opleidingcard voor light mode / dark mode
  const colors = isEnabled
    ? {
        card: "#1f2937",
        imageBox: "#111827",
        text: "#f9fafb",
        subText: "#d1d5db",
        accent: "#0bab77",
      }
    : {
        card: "#fff",
        imageBox: "#f5f7fb",
        text: "#111827",
        subText: "#6b7280",
        accent: "#0bab77",
      };

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* Opleidingafbeelding */}
      <View
        style={[styles.imageContainer, { backgroundColor: colors.imageBox }]}
      >
        {image ? (
          <Image source={image} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={[styles.noImageText, { color: colors.subText }]}>
            Geen afbeelding
          </Text>
        )}
      </View>

      {/* Kleine labeltekst */}
      <Text style={[styles.category, { color: colors.subText }]}>
        Opleiding
      </Text>

      {/* Titel, campus en beschrijving */}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {campus ? (
        <Text style={[styles.campus, { color: colors.accent }]}>{campus}</Text>
      ) : null}

      <Text style={[styles.description, { color: colors.subText }]}>
        {description}
      </Text>

      {/* Knop naar details */}
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Bekijk opleiding</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  // Hele opleidingcard
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

  // Container rond afbeelding
  imageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 14,
  },

  // Afbeelding zelf
  image: {
    width: "100%",
    height: "100%",
  },

  // Tekst als er geen afbeelding is
  noImageText: {
    fontSize: 14,
  },

  // Klein label boven titel
  category: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
  },

  // Opleidingtitel
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  // Campusnaam
  campus: {
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
    backgroundColor: "#0bab77",
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

export default ProgramCard;
