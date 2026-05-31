import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useState } from "react";

const ContactScreen = ({ isEnabled }) => {
  // State voor formulier
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [message, setMessage] = useState("");

  // Standaardkleur van de website
  const defaultGreen = "#86bc25";

  // Kleurenset voor light mode / dark mode
  const colors = isEnabled
    ? {
        background: "#111827",
        card: "#1f2937",
        text: "#f9fafb",
        subText: "#d1d5db",
        border: "#374151",
        inputBackground: "#111827",
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

  // Formulier verzenden
  const sendMessage = () => {
    if (!firstName || !lastName || !emailInput || !message) {
      Alert.alert("Fout", "Gelieve alle velden in te vullen.");
      return;
    }

    Alert.alert(
      "Bericht verzonden",
      `Bedankt ${firstName}, we nemen zo snel mogelijk contact met je op.`,
    );

    setFirstName("");
    setLastName("");
    setEmailInput("");
    setMessage("");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Titel en korte intro */}
      <Text style={[styles.heading, { color: colors.text }]}>Contact</Text>

      <Text style={[styles.subText, { color: colors.subText }]}>
        Heb je een vraag? Neem contact op met Busleyden Atheneum.
      </Text>

      {/* Contactgegevens */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Contactgegevens
        </Text>

        <Text style={[styles.infoLabel, { color: colors.accent }]}>E-mail</Text>
        <Text style={[styles.infoText, { color: colors.subText }]}>
          info@school.be
        </Text>

        <Text style={[styles.infoLabel, { color: colors.accent }]}>
          Telefoon
        </Text>
        <Text style={[styles.infoText, { color: colors.subText }]}>
          015 00 00 00
        </Text>

        <Text style={[styles.infoLabel, { color: colors.accent }]}>Adres</Text>
        <Text style={[styles.infoText, { color: colors.subText }]}>
          Wegstraat 10, Mechelen
        </Text>
      </View>

      {/* Contactformulier */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Stuur ons een bericht
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Voornaam"
          placeholderTextColor={colors.subText}
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Achternaam"
          placeholderTextColor={colors.subText}
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="E-mailadres"
          placeholderTextColor={colors.subText}
          value={emailInput}
          onChangeText={setEmailInput}
          keyboardType="email-address"
        />

        <TextInput
          style={[
            styles.messageInput,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="Bericht"
          placeholderTextColor={colors.subText}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={5}
        />

        <Pressable
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={sendMessage}
        >
          <Text style={styles.buttonText}>Verstuur bericht</Text>
        </Pressable>
      </View>

      {/* Nieuwsbrief */}
      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Nieuwsbrief
        </Text>

        <Text style={[styles.infoText, { color: colors.subText }]}>
          Schrijf je in voor de nieuwsbrief en blijf op de hoogte van nieuws,
          events en opleidingen.
        </Text>

        <Pressable
          style={[styles.newsletterButton, { backgroundColor: colors.accent }]}
          onPress={() =>
            Alert.alert("Nieuwsbrief", "Je werd toegevoegd aan de nieuwsbrief.")
          }
        >
          <Text style={styles.buttonText}>Inschrijven</Text>
        </Pressable>
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

  // Sectietitel
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },

  // Kleine label bij contactgegevens
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
  },

  // Info tekst
  infoText: {
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 4,
  },

  // Inputvelden
  input: {
    width: "100%",
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
  },

  // Groot berichtveld
  messageInput: {
    width: "100%",
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },

  // Groene knop
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },

  // Nieuwsbriefknop
  newsletterButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },

  // Tekst in knoppen
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ContactScreen;
