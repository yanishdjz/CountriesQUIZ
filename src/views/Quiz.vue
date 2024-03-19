<template>
  <div id="quiz-page">
    <div v-if="gameStarted">
      <img :src="flagUrl" alt="Drapeau" style="max-width: 200px;">
      <p>{{ countryName }}</p>
      <a :href="mapLink" target="_blank">Voir sur Google Maps</a> <!-- Lien vers Google Maps -->
      <p>{{ question }}</p>
      <input type="text" v-model="userGuess" @keyup.enter="checkAnswer">
      <button @click="checkAnswer">Valider</button>
      <p :class="{ 'correct-answer': feedback === 'Correct!', 'incorrect-answer': feedback !== 'Correct!' }">{{ feedback }}</p>
      <button @click="nextQuestion">Question suivante</button>
      <p>Score: {{ score }}</p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'QuizPage',
  data() {
    return {
      gameStarted: false,
      countries: [],
      countryName: '',
      capital: '',
      flagUrl: '',
      userGuess: '',
      feedback: '',
      score: 0,
      question: "Quelle est la capitale de ce pays ?"
    }
  },
  mounted() {
    this.startGame();
  },
  methods: {
    startGame() {
      this.gameStarting = true; // Indiquer que le jeu est en cours de démarrage
      // Effectuer les opérations nécessaires pour démarrer le jeu, comme fetchCountries()
      fetch('https://restcountries.com/v3.1/all')
          .then(response => response.json())
          .then(data => {
            this.countries = data;
            this.nextQuestion();
            this.gameStarted = true; // Indiquer que le jeu a démarré
            this.gameStarting = false; // Réinitialiser l'état de démarrage du jeu
          })
          .catch(error => {
            console.error('Une erreur est survenue lors de la récupération des pays :', error);
            // Afficher un message d'erreur à l'utilisateur
            this.gameStarting = false; // Réinitialiser l'état de démarrage du jeu en cas d'erreur
          });
    },
    nextQuestion() {
      const randomIndex = Math.floor(Math.random() * this.countries.length);
      const country = this.countries[randomIndex];
      this.countryName = country.name.common;
      this.capital = country.capital[0] || 'N/A';
      this.flagUrl = country.flags.svg || 'N/A';
      this.mapLink = country.maps.googleMaps || ''; // Lien vers Google Maps
      this.userGuess = '';
      this.feedback = '';
    },
    checkAnswer() {
      const userGuessTrimmed = this.userGuess.trim().toLowerCase();
      const capitalTrimmed = this.capital.toLowerCase();
      const commonLetters = this.getCommonLetters(userGuessTrimmed, capitalTrimmed);

      if (userGuessTrimmed === capitalTrimmed) {
        this.feedback = 'Correct!'; // Réponse parfaite
        this.score += 2;
      } else if (commonLetters.length / capitalTrimmed.length >= 0.7) {
        this.feedback = 'Presque correct!'; // 70 % ou plus de lettres en commun
        this.score += 1;
      } else {
        this.feedback = `Incorrect!  La capitale est ${this.capital}.`;
      }
    },
    getCommonLetters(str1, str2) {
      const commonLetters = [];
      for (let char of str1) {
        if (str2.includes(char) && !commonLetters.includes(char)) {
          commonLetters.push(char);
        }
      }
      return commonLetters;
    }
  }
}
</script>

<style scoped>
#quiz-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#quiz-page h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

#quiz-page img {
  max-width: 100%;
  height: auto;
  margin-bottom: 20px;
}

#quiz-page p {
  font-size: 18px;
  margin-bottom: 15px;
}

#quiz-page input[type="text"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

#quiz-page button {
  padding: 10px 20px;
  font-size: 18px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

#quiz-page button:hover {
  background-color: #0056b3;
}

#quiz-page .correct-answer {
  color: green;
  font-weight: bold;
}

#quiz-page .incorrect-answer {
  color: red;
  font-weight: bold;
}
</style>
