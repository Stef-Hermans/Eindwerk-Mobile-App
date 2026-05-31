import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, ScrollView, Image, View } from "react-native";

const NewsDetail = ({ route, isEnabled }) => {
  // Data die vanuit NewsScreen of HomeScreen wordt meegestuurd
  const {
    title,
    description,
    body,
    date,
    image,
    accentColor = "#86bc25",
  } = route.params;

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

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Titel van het scherm */}
      <Text style={[styles.screenTitle, { color: colors.text }]}>
        Nieuws details
      </Text>

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

      {/* Nieuwsinfo */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        {date ? (
          <Text style={[styles.date, { color: colors.accent }]}>{date}</Text>
        ) : null}

        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

        <Text style={[styles.description, { color: colors.subText }]}>
          {description}
        </Text>
      </View>

      {/* Volledige tekst */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Volledig artikel
        </Text>

        <Text style={[styles.bodyText, { color: colors.subText }]}>
          {body || "Er is nog geen extra tekst beschikbaar."}
        </Text>
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

  // Container rond nieuwsafbeelding
  imageContainer: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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

  // Datum van nieuws
  date: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Nieuwstitel
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Korte beschrijving
  description: {
    fontSize: 16,
    lineHeight: 23,
  },

  // Sectietitel
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Volledige tekst
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default NewsDetail;
