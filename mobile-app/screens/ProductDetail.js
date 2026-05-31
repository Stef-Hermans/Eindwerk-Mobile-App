import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  ScrollView,
  Image,
  View,
  Pressable,
  Button,
  Alert,
} from "react-native";
import { useState } from "react";

const ProductDetail = ({ route, isEnabled }) => {
  // Data die vanuit WebshopScreen of HomeScreen wordt doorgestuurd
  const {
    title,
    description,
    price,
    image,
    accentColor = "#86bc25",
  } = route.params;

  // State voor hoeveelheid producten
  const [quantity, setQuantity] = useState(1);

  // Kleurenset voor light mode / dark mode
  const colors = isEnabled
    ? {
        background: "#111827",
        card: "#1f2937",
        imageBox: "#111827",
        text: "#f9fafb",
        subText: "#d1d5db",
        accent: accentColor,
      }
    : {
        background: "#f5f7fb",
        card: "#ffffff",
        imageBox: "#f5f7fb",
        text: "#111827",
        subText: "#6b7280",
        accent: accentColor,
      };

  // Hoeveelheid verhogen
  const increaseQuantity = () => setQuantity(quantity + 1);

  // Hoeveelheid verlagen, maar niet onder 1
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Titel van het scherm */}
      <Text style={[styles.screenTitle, { color: colors.text }]}>
        Product details
      </Text>

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

      {/* Productinformatie */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.accent }]}>Product</Text>

        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

        <Text style={[styles.price, { color: colors.accent }]}>
          €{Number(price || 0).toFixed(2)}
        </Text>

        <Text style={[styles.description, { color: colors.subText }]}>
          {description}
        </Text>
      </View>

      {/* Aantal aanpassen met min en plus */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Aantal
        </Text>

        <View style={styles.quantityContainer}>
          <Pressable
            style={[styles.quantityButton, { backgroundColor: colors.accent }]}
            onPress={decreaseQuantity}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>

          <Text style={[styles.quantity, { color: colors.text }]}>
            {quantity}
          </Text>

          <Pressable
            style={[styles.quantityButton, { backgroundColor: colors.accent }]}
            onPress={increaseQuantity}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>
        </View>

        {/* Totaaloverzicht */}
        <Text style={[styles.totalText, { color: colors.subText }]}>
          Aantal producten: {quantity}
        </Text>

        <Text style={[styles.totalPrice, { color: colors.text }]}>
          Totaal: €{(quantity * Number(price || 0)).toFixed(2)}
        </Text>
      </View>

      {/* Koopknop */}
      <View style={styles.buyButtonContainer}>
        <Button
          title="Koop nu"
          onPress={() =>
            Alert.alert(
              "Bedankt!",
              `${quantity} x ${title} werd toegevoegd aan je winkelmandje.`,
            )
          }
          color={colors.accent}
        />
      </View>

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
    justifyContent: "flex-start",
    padding: 20,
    paddingTop: 40,
  },

  // Titel van detailscherm
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  // Container rond productafbeelding
  imageContainer: {
    width: "100%",
    height: 280,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
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

  // Kaart met info
  infoCard: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  // Label boven titel
  label: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },

  // Producttitel
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Productprijs
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Beschrijving van product
  description: {
    fontSize: 16,
    lineHeight: 23,
  },

  // Sectietitel
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },

  // Min en plus naast de hoeveelheid
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
  },

  // Groene min/plus knop
  quantityButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  // Tekst in min/plus knop
  quantityButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },

  // Getal tussen min en plus
  quantity: {
    fontSize: 20,
    fontWeight: "bold",
  },

  // Tekst van hoeveelheid
  totalText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },

  // Tekst van totaalprijs
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Container van koopknop
  buyButtonContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: 30,
  },
});

export default ProductDetail;
