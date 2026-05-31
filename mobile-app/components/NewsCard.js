import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

const NewsCard = ({ title, description, date, image, onPress, isEnabled }) => {
  // Kleurenset van de nieuwscard voor light mode / dark mode
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
      {/* Nieuwsafbeelding */}
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

      {/* Datum */}
      {date ? (
        <Text style={[styles.date, { color: colors.accent }]}>{date}</Text>
      ) : null}

      {/* Titel en samenvatting */}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.subText }]}>
        {description}
      </Text>

      {/* Knop naar details */}
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Lees meer</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  // Hele nieuwscard
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

  // Datum van nieuws
  date: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
  },

  // Nieuwstitel
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  // Samenvatting
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

export default NewsCard;
