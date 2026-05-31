import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Switch,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";

// Components importeren
import CampusCard from "../components/CampusCard";
import ProgramCard from "../components/ProgramCard";
import NewsCard from "../components/NewsCard";
import EventCard from "../components/EventCard";
import ProductCard from "../components/ProductCard";

const HomeScreen = ({ navigation, isEnabled, setIsEnabled }) => {
  // State voor data uit Webflow
  const [campuses, setCampuses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);

  // State voor zoekfunctie
  const [searchQuery, setSearchQuery] = useState("");

  // Kleuren voor light mode en dark mode
  const colors = isEnabled
    ? {
        background: "#111827",
        card: "#1f2937",
        text: "#f9fafb",
        subText: "#d1d5db",
        border: "#374151",
        inputBackground: "#1f2937",
        accent: "#86bc25",
      }
    : {
        background: "#f5f7fb",
        card: "#ffffff",
        text: "#111827",
        subText: "#6b7280",
        border: "#d1d5db",
        inputBackground: "#ffffff",
        accent: "#86bc25",
      };

  // Standaardkleur van Busleyden
  const DEFAULT_GREEN = "#86bc25";

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

  // Datum mooier maken
  const formatDate = (date) => {
    if (!date) return "";

    return String(date);
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
      fieldData.afbeelding ||
      fieldData["main-image"] ||
      fieldData.foto ||
      fieldData.thumbnail ||
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
      fieldData.color ||
      fieldData.Color ||
      fieldData.Kleur ||
      DEFAULT_GREEN
    );
  };

  // Korte beschrijving zoeken
  const getDescription = (fieldData, fallback) => {
    return (
      cleanText(fieldData["korte-beschrijving"]) ||
      cleanText(fieldData["short-description"]) ||
      cleanText(fieldData["Korte beschrijving"]) ||
      cleanText(fieldData.description) ||
      cleanText(fieldData.Description) ||
      cleanText(fieldData.samenvatting) ||
      cleanText(fieldData.summary) ||
      fallback
    );
  };

  // Lange tekst zoeken
  const getBody = (fieldData) => {
    return (
      cleanText(fieldData["volledige-uitleg-campus"]) ||
      cleanText(fieldData["uitgebreide-tekst"]) ||
      cleanText(fieldData["volledige-tekst"]) ||
      cleanText(fieldData["wat-houdt-deze-richting-in"]) ||
      cleanText(fieldData["wat-leer-je"]) ||
      cleanText(fieldData["toekomstmogelijkheden"]) ||
      cleanText(fieldData.description) ||
      cleanText(fieldData.body)
    );
  };

  useEffect(() => {
    // CAMPUSSEN OPHALEN UIT WEBFLOW
    fetch(
      "https://api.webflow.com/v2/sites/6a145e3f272bd80bb3bf3bd7/collections/6a15e32ecd71eefc575a7215/items",
      {
        headers: {
          Authorization:
            "Bearer f24bd791bf8521d74cc19a322de75ba5d59a0d39b3ffc08426f177f7cb87c262",
        },
      },
    )
      .then((res) => res.json())
      .then((data) =>
        setCampuses(
          (data.items || []).map((item) => ({
            id: item.id,
            title: item.fieldData.name,

            description: getDescription(
              item.fieldData,
              "Ontdek deze campus van Busleyden Atheneum.",
            ),

            body: getBody(item.fieldData),

            address:
              item.fieldData.adres ||
              item.fieldData.address ||
              "Zandpoortvest 60, 2800 Mechelen",

            email: item.fieldData.email || "info@campus.be",

            // BELANGRIJK: campussen gebruiken image, niet main-image
            image: getImage(item.fieldData),

            // Kleur uit Webflow of standaardgroen
            accentColor: getColor(item.fieldData),
          })),
        ),
      )
      .catch((error) => console.error("Error fetching campussen:", error));

    // OPLEIDINGEN OPHALEN UIT WEBFLOW
    fetch(
      "https://api.webflow.com/v2/sites/6a145e3f272bd80bb3bf3bd7/collections/6a15e871a69c876374767dc9/items",
      {
        headers: {
          Authorization:
            "Bearer 938cca162f2d846aaea143770e488ce333e0a9052c910633e46949035e1a470a",
        },
      },
    )
      .then((res) => res.json())
      .then((data) =>
        setPrograms(
          (data.items || []).map((item) => {
            const campusValue =
              item.fieldData.campus ||
              item.fieldData["campus-naam"] ||
              item.fieldData.locatie;

            return {
              id: item.id,
              title: item.fieldData.name,

              tag: item.fieldData.tag || "",

              description: getDescription(
                item.fieldData,
                "Ontdek deze opleiding bij Busleyden Atheneum.",
              ),

              body: getBody(item.fieldData),

              // Als campus een Webflow reference ID is, tonen we die niet
              campus: isWebflowId(campusValue)
                ? "Busleyden Atheneum"
                : campusValue || "Busleyden Atheneum",

              image: getImage(item.fieldData),

              // Opleidingen hebben Color in Webflow
              accentColor: getColor(item.fieldData),
            };
          }),
        ),
      )
      .catch((error) => console.error("Error fetching opleidingen:", error));

    // NIEUWS OPHALEN UIT WEBFLOW
    fetch(
      "https://api.webflow.com/v2/sites/6a145e3f272bd80bb3bf3bd7/collections/6a19fff5ae9607a1996d2707/items",
      {
        headers: {
          Authorization:
            "Bearer 1576a8b1a009c6710ee81292dcc5df6657d82627753fdc3a34e52464c66356f7",
        },
      },
    )
      .then((res) => res.json())
      .then((data) =>
        setNews(
          (data.items || []).map((item) => ({
            id: item.id,
            title: item.fieldData.name,

            description: getDescription(
              item.fieldData,
              "Lees meer over dit nieuwsbericht.",
            ),

            body:
              cleanText(item.fieldData["uitgebreide-tekst"]) ||
              cleanText(item.fieldData["volledige-tekst"]) ||
              getBody(item.fieldData),

            // Nieuws heeft een veld Datum in Webflow
            date:
              item.fieldData.datum ||
              item.fieldData.date ||
              formatDate(item.lastPublished || item.createdOn),

            image: getImage(item.fieldData),

            accentColor: getColor(item.fieldData),
          })),
        ),
      )
      .catch((error) => console.error("Error fetching nieuws:", error));

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
              title: item.fieldData.name,

              description: getDescription(
                item.fieldData,
                "Kom langs tijdens dit event.",
              ),

              body:
                cleanText(item.fieldData.description) ||
                cleanText(item.fieldData.Description) ||
                getBody(item.fieldData),

              // Event Datum is bij jou een reference, dus voorlopig tonen we anders de publicatiedatum
              date:
                item.fieldData.datum ||
                item.fieldData.date ||
                formatDate(item.createdOn),

              time:
                item.fieldData["start-en-eind-uur"] ||
                item.fieldData["Start en eind uur"] ||
                "",

              location: isWebflowId(locationValue)
                ? "Busleyden Atheneum"
                : locationValue || "Busleyden Atheneum",

              speaker:
                item.fieldData.spreker ||
                item.fieldData.Spreker ||
                "Busleyden Atheneum",

              image: getImage(item.fieldData),

              accentColor: getColor(item.fieldData),
            };
          }),
        ),
      )
      .catch((error) => console.error("Error fetching events:", error));

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
            title: item.product.fieldData.name,
            description:
              item.product.fieldData.description ||
              "Product uit de Busleyden webshop.",
            price: (item.skus[0]?.fieldData.price?.value || 0) / 100,
            image: item.skus[0]?.fieldData["main-image"]?.url
              ? {
                  uri: item.skus[0].fieldData["main-image"].url,
                }
              : null,
          })),
        ),
      )
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // CAMPUSSEN FILTEREN
  const filteredCampuses = campuses.filter((campus) =>
    campus.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // OPLEIDINGEN FILTEREN
  const filteredPrograms = programs.filter((program) =>
    program.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // NIEUWS FILTEREN
  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // EVENTS FILTEREN
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // PRODUCTEN FILTEREN
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Titel en korte intro */}
      <Text style={[styles.heading, { color: colors.text }]}>
        Busleyden Atheneum
      </Text>

      <Text style={[styles.subText, { color: colors.subText }]}>
        Ontdek jouw talent, bouw aan je toekomst.
      </Text>

      {/* Algemene zoekfunctie */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        placeholder="Zoek een campus, opleiding, nieuws..."
        placeholderTextColor={colors.subText}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Dark mode switch */}
      <View style={[styles.switchContainer, { backgroundColor: colors.card }]}>
        <Text style={{ color: colors.text }}>Dark mode</Text>
        <Switch
          value={isEnabled}
          onValueChange={() => setIsEnabled(!isEnabled)}
          trackColor={{ false: "#d1d5db", true: "#86bc25" }}
          thumbColor={isEnabled ? "#86bc25" : "#f4f3f4"}
        />
      </View>

      {/* Intro blok */}
      <View style={[styles.introBox, { backgroundColor: colors.card }]}>
        <Text style={[styles.introTitle, { color: colors.text }]}>
          Jouw toekomst, jouw keuze
        </Text>

        <Text style={[styles.introText, { color: colors.subText }]}>
          Bij Busleyden Atheneum vind je opleidingen, campussen en begeleiding
          die passen bij jouw interesses en talenten.
        </Text>

        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.smallButton, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate("Opleidingen")}
          >
            <Text style={styles.smallButtonText}>Opleidingen</Text>
          </Pressable>

          <Pressable
            style={[styles.smallButton, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate("Campussen")}
          >
            <Text style={styles.smallButtonText}>Campussen</Text>
          </Pressable>
        </View>
      </View>

      {/* CAMPUSSEN SECTIE */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Campussen
        </Text>

        <Pressable onPress={() => navigation.navigate("Campussen")}>
          <Text style={[styles.seeAllText, { color: colors.accent }]}>
            Bekijk alles
          </Text>
        </Pressable>
      </View>

      {filteredCampuses.slice(0, 2).map((campus) => (
        <CampusCard
          key={campus.id}
          title={campus.title}
          description={campus.description}
          image={campus.image}
          onPress={() => navigation.navigate("CampusDetail", campus)}
          isEnabled={isEnabled}
        />
      ))}

      {/* OPLEIDINGEN SECTIE */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Opleidingen
        </Text>

        <Pressable onPress={() => navigation.navigate("Opleidingen")}>
          <Text style={[styles.seeAllText, { color: colors.accent }]}>
            Bekijk alles
          </Text>
        </Pressable>
      </View>

      {filteredPrograms.slice(0, 2).map((program) => (
        <ProgramCard
          key={program.id}
          title={program.title}
          description={program.description}
          campus={program.campus}
          image={program.image}
          onPress={() => navigation.navigate("ProgramDetail", program)}
          isEnabled={isEnabled}
        />
      ))}

      {/* NIEUWS SECTIE */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Nieuws
        </Text>

        <Pressable onPress={() => navigation.navigate("Nieuws")}>
          <Text style={[styles.seeAllText, { color: colors.accent }]}>
            Bekijk alles
          </Text>
        </Pressable>
      </View>

      {filteredNews.slice(0, 2).map((item) => (
        <NewsCard
          key={item.id}
          title={item.title}
          description={item.description}
          date={item.date}
          image={item.image}
          onPress={() => navigation.navigate("NewsDetail", item)}
          isEnabled={isEnabled}
        />
      ))}

      {/* EVENTS SECTIE */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Events
        </Text>

        <Pressable onPress={() => navigation.navigate("Events")}>
          <Text style={[styles.seeAllText, { color: colors.accent }]}>
            Bekijk alles
          </Text>
        </Pressable>
      </View>

      {filteredEvents.slice(0, 2).map((event) => (
        <EventCard
          key={event.id}
          title={event.title}
          description={event.description}
          date={event.date}
          location={event.location}
          onPress={() => navigation.navigate("EventDetail", event)}
          isEnabled={isEnabled}
        />
      ))}

      {/* WEBSHOP SECTIE */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Webshop
        </Text>

        <Pressable onPress={() => navigation.navigate("Webshop")}>
          <Text style={[styles.seeAllText, { color: colors.accent }]}>
            Bekijk alles
          </Text>
        </Pressable>
      </View>

      {filteredProducts.slice(0, 2).map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          description={product.description}
          price={product.price}
          image={product.image}
          onPress={() => navigation.navigate("ProductDetail", product)}
          isEnabled={isEnabled}
        />
      ))}

      {/* Contact knop onderaan */}
      <Pressable
        style={[styles.contactButton, { backgroundColor: colors.accent }]}
        onPress={() => navigation.navigate("Contact")}
      >
        <Text style={styles.contactButtonText}>Contacteer ons</Text>
      </Pressable>

      {/* StatusBar mee laten veranderen met dark mode */}
      <StatusBar style={isEnabled ? "light" : "dark"} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Algemene container van de pagina
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

  // Box van dark mode switch
  switchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    padding: 12,
    borderRadius: 12,
  },

  // Intro box bovenaan
  introBox: {
    width: "100%",
    borderRadius: 18,
    padding: 18,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  // Titel in intro box
  introTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  // Tekst in intro box
  introText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },

  // Rij met knoppen
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },

  // Kleine groene knop
  smallButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  // Tekst in kleine knop
  smallButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  // Header van een sectie
  sectionHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
  },

  // Sectietitel zoals Campussen / Opleidingen
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },

  // Bekijk alles tekst
  seeAllText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  // Contact knop onderaan
  contactButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },

  // Tekst in contact knop
  contactButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default HomeScreen;
