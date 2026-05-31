import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  ScrollView,
  Image,
  View,
  Pressable,
  Alert,
} from "react-native";

const EventDetail = ({ route, isEnabled }) => {
  // Data die vanuit EventsScreen of HomeScreen wordt meegestuurd
  const {
    title,
    description,
    body,
    date,
    time,
    location,
    speaker,
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
        Event details
      </Text>

      {/* Eventafbeelding */}
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

      {/* Eventinformatie */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.label, { color: colors.accent }]}>Event</Text>

        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

        <Text style={[styles.description, { color: colors.subText }]}>
          {description}
        </Text>
      </View>

      {/* Praktische info */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Praktische info
        </Text>

        <Text style={[styles.infoLabel, { color: colors.accent }]}>Datum</Text>
        <Text style={[styles.infoText, { color: colors.subText }]}>
          {date || "Datum niet beschikbaar"}
        </Text>

        <Text style={[styles.infoLabel, { color: colors.accent }]}>Uur</Text>
        <Text style={[styles.infoText, { color: colors.subText }]}>
          {time || "Uur niet beschikbaar"}
        </Text>

        <Text style={[styles.infoLabel, { color: colors.accent }]}>
          Locatie
        </Text>
        <Text style={[styles.infoText, { color: colors.subText }]}>
          {location || "Locatie niet beschikbaar"}
        </Text>

        <Text style={[styles.infoLabel, { color: colors.accent }]}>
          Spreker
        </Text>
        <Text style={[styles.infoText, { color: colors.subText }]}>
          {speaker || "Spreker niet beschikbaar"}
        </Text>
      </View>

      {/* Volledige tekst */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Over dit event
        </Text>

        <Text style={[styles.bodyText, { color: colors.subText }]}>
          {body || "Er is nog geen extra informatie beschikbaar."}
        </Text>
      </View>

      {/* Inschrijfknop */}
      <Pressable
        style={[styles.button, { backgroundColor: colors.accent }]}
        onPress={() =>
          Alert.alert(
            "Inschrijving",
            `Je interesse voor ${title} werd genoteerd.`,
          )
        }
      >
        <Text style={styles.buttonText}>Ik ben geïnteresseerd</Text>
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

  // Container rond eventafbeelding
  imageContainer: {
    width: "100%",
    height: 220,
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

  // Label boven titel
  label: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
  },

  // Eventtitel
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

  // Sectietitels
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  // Kleine titel bij praktische info
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
  },

  // Praktische info tekst
  infoText: {
    fontSize: 15,
    lineHeight: 22,
  },

  // Volledige tekst
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
  },

  // Groene knop
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 30,
  },

  // Tekst in knop
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EventDetail;
