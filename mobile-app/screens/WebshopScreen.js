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
import ProductCard from "../components/ProductCard";

const WebshopScreen = ({ navigation, isEnabled }) => {
  // State voor producten uit Webflow
  const [products, setProducts] = useState([]);

  // State voor zoekfunctie
  const [searchQuery, setSearchQuery] = useState("");

  // State voor sortering
  const [sortOption, setSortOption] = useState("price-asc");

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

  useEffect(() => {
    // PRODUCTEN OPHALEN UIT WEBFLOW
    fetch(
      "https://api.webflow.com/v2/sites/6a145e3f272bd80bb3bf3bd7/products",
      {
        headers: {
          Authorization:
            "Bearer 3748489b2b6548d5c1431dc831764f8ce707b4e6223e47a3c26a1117c549f627",
        },
      },
    )
      .then((res) => res.json())
      .then((data) =>
        setProducts(
          (data.items || []).map((item) => ({
            id: item.product.id,

            // Productnaam
            title: item.product.fieldData.name,

            // Productbeschrijving
            description:
              item.product.fieldData.description ||
              "Product uit de Busleyden webshop.",

            // Prijs uit Webflow
            price: (item.skus[0]?.fieldData.price?.value || 0) / 100,

            // Productafbeelding
            image: item.skus[0]?.fieldData["main-image"]?.url
              ? {
                  uri: item.skus[0].fieldData["main-image"].url,
                }
              : null,

            // Publicatiedatum voor eventueel later gebruik
            publishedOn: item.product.lastPublished || item.product.createdOn,
          })),
        ),
      )
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Producten filteren op zoekterm
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Producten sorteren
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "name-asc") return a.title.localeCompare(b.title);
    if (sortOption === "name-desc") return b.title.localeCompare(a.title);
    return 0;
  });

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Titel en korte intro */}
      <Text style={[styles.heading, { color: colors.text }]}>Webshop</Text>

      <Text style={[styles.subText, { color: colors.subText }]}>
        Bekijk alle producten van Busleyden Atheneum.
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
        placeholder="Zoek een product..."
        placeholderTextColor={colors.subText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Aantal resultaten */}
      <View style={[styles.resultBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.resultText, { color: colors.text }]}>
          {sortedProducts.length} producten gevonden
        </Text>
      </View>

      {/* Sorteerknoppen */}
      <View style={[styles.filterBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.filterTitle, { color: colors.text }]}>
          Sorteer producten
        </Text>

        <View style={styles.sortRow}>
          <Pressable
            style={[
              styles.sortButton,
              {
                backgroundColor:
                  sortOption === "price-asc"
                    ? colors.accent
                    : colors.background,
              },
            ]}
            onPress={() => setSortOption("price-asc")}
          >
            <Text
              style={[
                styles.sortButtonText,
                {
                  color: sortOption === "price-asc" ? "#fff" : colors.text,
                },
              ]}
            >
              Prijs ↑
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.sortButton,
              {
                backgroundColor:
                  sortOption === "price-desc"
                    ? colors.accent
                    : colors.background,
              },
            ]}
            onPress={() => setSortOption("price-desc")}
          >
            <Text
              style={[
                styles.sortButtonText,
                {
                  color: sortOption === "price-desc" ? "#fff" : colors.text,
                },
              ]}
            >
              Prijs ↓
            </Text>
          </Pressable>
        </View>

        <View style={styles.sortRow}>
          <Pressable
            style={[
              styles.sortButton,
              {
                backgroundColor:
                  sortOption === "name-asc" ? colors.accent : colors.background,
              },
            ]}
            onPress={() => setSortOption("name-asc")}
          >
            <Text
              style={[
                styles.sortButtonText,
                {
                  color: sortOption === "name-asc" ? "#fff" : colors.text,
                },
              ]}
            >
              Naam A-Z
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.sortButton,
              {
                backgroundColor:
                  sortOption === "name-desc"
                    ? colors.accent
                    : colors.background,
              },
            ]}
            onPress={() => setSortOption("name-desc")}
          >
            <Text
              style={[
                styles.sortButtonText,
                {
                  color: sortOption === "name-desc" ? "#fff" : colors.text,
                },
              ]}
            >
              Naam Z-A
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Productcards tonen */}
      {sortedProducts.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          description={product.description}
          price={product.price}
          image={product.image}
          accentColor={colors.accent}
          onPress={() => navigation.navigate("ProductDetail", product)}
          isEnabled={isEnabled}
        />
      ))}

      {/* Tekst als er niets gevonden wordt */}
      {sortedProducts.length === 0 && (
        <Text style={[styles.emptyText, { color: colors.subText }]}>
          Geen producten gevonden.
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
    marginBottom: 14,
  },

  // Tekst aantal resultaten
  resultText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Filterbox rond sorteerknoppen
  filterBox: {
    width: "100%",
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },

  // Titel boven sortering
  filterTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Rij met sorteerknoppen
  sortRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },

  // Sorteerknop
  sortButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  // Tekst in sorteerknop
  sortButtonText: {
    fontWeight: "bold",
    fontSize: 14,
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

export default WebshopScreen;
