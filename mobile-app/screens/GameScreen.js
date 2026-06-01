import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, Alert, Image } from "react-native";
import { useEffect, useState } from "react";
import docentFoto from "../images/docent.jpg";

const GameScreen = ({ isEnabled }) => {
  // State voor score, tijd en actief vakje
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isGameActive, setIsGameActive] = useState(true);

  // Standaardkleur van Busleyden
  const defaultGreen = "#86bc25";

  // Namen van docenten voor in de vakjes
  const teacher = {
    name: "Evi Vermeêren",
    image: docentFoto,
  };

  // Aantal vakjes in het spel
  const holes = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // Kleuren voor light mode en dark mode
  const colors = isEnabled
    ? {
        background: "#111827",
        card: "#1f2937",
        text: "#f9fafb",
        subText: "#d1d5db",
        hole: "#374151",
        accent: defaultGreen,
      }
    : {
        background: "#f5f7fb",
        card: "#ffffff",
        text: "#111827",
        subText: "#6b7280",
        hole: "#e5e7eb",
        accent: defaultGreen,
      };

  // Random nieuw vakje kiezen
  const showRandomTeacher = () => {
    let randomIndex = Math.floor(Math.random() * holes.length);

    // Zorgt ervoor dat de docent niet twee keer na elkaar in hetzelfde vakje zit
    while (randomIndex === activeIndex) {
      randomIndex = Math.floor(Math.random() * holes.length);
    }

    setActiveIndex(randomIndex);
  };

  // Timer laten aftellen
  useEffect(() => {
    if (!isGameActive) return;

    if (timeLeft === 0) {
      setIsGameActive(false);
      setActiveIndex(null);
      Alert.alert("Game over!", `Je eindscore is ${score}.`);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isGameActive]);

  // Docent laten wisselen
  useEffect(() => {
    if (!isGameActive) return;

    showRandomTeacher();

    const teacherTimer = setInterval(() => {
      showRandomTeacher();
    }, 1500);

    return () => clearInterval(teacherTimer);
  }, [isGameActive]);

  // Klik op een vakje
  const handlePress = (index) => {
    if (!isGameActive) return;

    if (index === activeIndex) {
      setScore(score + 1);
      showRandomTeacher();
    } else {
      if (score > 0) {
        setScore(score - 1);
      }
    }
  };

  // Game opnieuw starten
  const restartGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsGameActive(true);
    showRandomTeacher();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Titel */}
      <Text style={[styles.heading, { color: colors.text }]}>
        Whack-a-docent
      </Text>

      <Text style={[styles.subText, { color: colors.subText }]}>
        Tik zo snel mogelijk op het hoofd van de docent en verzamel punten. Maar
        pas op, als je mist of te laat bent, verlies je punten!
      </Text>

      {/* Score en timer */}
      <View style={[styles.scoreCard, { backgroundColor: colors.card }]}>
        <View style={styles.scoreBox}>
          <Text style={[styles.scoreLabel, { color: colors.subText }]}>
            Score
          </Text>
          <Text style={[styles.scoreValue, { color: colors.accent }]}>
            {score}
          </Text>
        </View>

        <View style={styles.scoreBox}>
          <Text style={[styles.scoreLabel, { color: colors.subText }]}>
            Tijd
          </Text>
          <Text style={[styles.scoreValue, { color: colors.accent }]}>
            {timeLeft}s
          </Text>
        </View>
      </View>

      {/* Game grid */}
      <View style={styles.grid}>
        {holes.map((hole, index) => (
          <Pressable
            key={index}
            style={[
              styles.hole,
              {
                backgroundColor:
                  activeIndex === index ? colors.accent : colors.hole,
              },
            ]}
            onPress={() => handlePress(index)}
          >
            {activeIndex === index ? (
              <View style={styles.teacherHead}>
                <Image source={teacher.image} style={styles.teacherImage} />
                <Text style={styles.teacherName}>{teacher.name}</Text>
              </View>
            ) : (
              <Text style={[styles.emptyText, { color: colors.subText }]}>
                •
              </Text>
            )}
          </Pressable>
        ))}
      </View>

      {/* Restart knop */}
      <Pressable
        style={[styles.restartButton, { backgroundColor: colors.accent }]}
        onPress={restartGame}
      >
        <Text style={styles.restartButtonText}>Restart game</Text>
      </Pressable>

      {!isGameActive && (
        <Text style={[styles.gameOverText, { color: colors.text }]}>
          Game over! Druk op restart om opnieuw te spelen.
        </Text>
      )}

      {/* StatusBar aanpassen aan dark mode */}
      <StatusBar style={isEnabled ? "light" : "dark"} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Algemene container
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },

  // Grote titel
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  // Korte beschrijving
  subText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },

  // Kaart rond score en tijd
  scoreCard: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  // Scoreblok
  scoreBox: {
    alignItems: "center",
  },

  // Label zoals Score / Tijd
  scoreLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },

  // Score en tijd waarde
  scoreValue: {
    fontSize: 28,
    fontWeight: "bold",
  },

  // Grid met vakjes
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },

  // Elk vakje
  hole: {
    width: 95,
    height: 95,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // Hoofd van docent
  teacherHead: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Foto docent
  teacherImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 4,
  },

  // Naam docent
  teacherName: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Leeg vakje
  emptyText: {
    fontSize: 28,
    fontWeight: "bold",
  },

  // Restart knop
  restartButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 28,
  },

  // Tekst in restart knop
  restartButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Game over tekst
  gameOverText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 18,
  },
});

export default GameScreen;
