import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

const ProductCard = ({
  title,
  description,
  price,
  image,
  onPress,
  isEnabled,
}) => {
  // Kleurenset van de productcard voor light mode / dark mode
  const colors = isEnabled
    ? {
        card: "#1f2937",
        imageBox: "#111827",
        text: "#f9fafb",
        subText: "#d1d5db",
        accent: "#86bc25",
      }
    : {
        card: "#fff",
        imageBox: "#f5f7fb",
        text: "#111827",
        subText: "#6b7280",
        accent: "#86bc25",
      };

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* Productafbeelding */}
      <View
        style={[styles.imageContainer, { backgroundColor: colors.imageBox }]}
      >
        {image ? (
          <Image source={image} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={[styles.noImageText, { color: colors.subText }]}>
            Geen afbeelding
          </Text>
        )}
      </View>

      {/* Kleine labeltekst */}
      <Text style={[styles.category, { color: colors.subText }]}>Product</Text>

      {/* Titel, prijs en beschrijving */}
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <Text style={[styles.price, { color: colors.accent }]}>
        €{Number(price || 0).toFixed(2)}
      </Text>

      <Text style={[styles.description, { color: colors.subText }]}>
        {description}
      </Text>

      {/* Knop naar details */}
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Bekijk details</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  // Hele productcard
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
    height: 220,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 14,
  },

  // Afbeelding zelf
  image: {
    width: "90%",
    height: "90%",
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

  // Producttitel
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  // Productprijs
  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Beschrijving
  description: {
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 20,
  },

  // Groene knop naar details
  button: {
    backgroundColor: "#86bc25",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  // Tekst in de knop
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default ProductCard;
