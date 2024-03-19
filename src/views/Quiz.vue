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
    <div v-else>
      <button @click="startGame">Commencer le jeu</button>
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
  methods: {
    startGame() {
      this.gameStarted = true;
      this.fetchCountries();
    },
    fetchCountries() {
      fetch('https://restcountries.com/v3.1/all')
          .then(response => response.json())
          .then(data => {
            this.countries = data;
            this.nextQuestion();
          })
          .catch(error => {
            console.error('Une erreur est survenue lors de la récupération des pays :', error);
            // Afficher un message d'erreur à l'utilisateur
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
      if (this.userGuess.trim().toLowerCase() === this.capital.toLowerCase()) {
        this.feedback = 'Correct!';
        this.score++;
      } else {
        this.feedback = `Incorrect! La capitale est ${this.capital}.`;
      }
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.correct-answer {
  color: green;
}

.incorrect-answer {
  color: red;
}
</style>
