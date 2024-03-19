<template>
  <div id="quiz-page">
    <div v-if="gameStarted">
      <p>Question {{ questionNumber }} / {{ totalQuestions }}</p>
      <p><button @click="restartGame">Recommencer</button></p>
      <img :src="flagUrl" alt="Drapeau" style="max-width: 300px;">
      <p>{{ countryName }}</p>
      <a :href="mapLink" target="_blank">Voir sur Google Maps</a> <!-- Lien vers Google Maps -->
      <p>{{ question }}</p>
      <input type="text" v-model="userGuess" @keyup.enter="checkAnswer" :disabled="isAnswered">
      <button @click="checkAnswer" :disabled="isAnswered">Valider</button>
      <button @click="skipQuestion" :disabled="isAnswered">Skip</button>
      <p :class="{ 'correct-answer': feedback === 'Correct!', 'incorrect-answer': feedback !== 'Correct!' }">{{ feedback }}</p>
      <p v-if="showCorrectAnswer">La réponse correcte est : {{ capital }}</p>
      <p>Score: {{ score }}</p>
      <button v-if="showNextQuestionButton" @click="nextQuestion">Question suivante</button>

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
      question: "Quelle est la capitale de ce pays ?",
      showCorrectAnswer: false,
      showNextQuestionButton: false,
      isAnswered: false,
      questionNumber: 0,
      totalQuestions: 20 // Nombre total de questions par partie
    }
  },
  mounted() {
    this.startGame();
  },
  methods: {
    startGame() {
      this.gameStarting = true;
      fetch('https://restcountries.com/v3.1/all')
          .then(response => response.json())
          .then(data => {
            this.countries = data;
            this.nextQuestion();
            this.gameStarted = true;
            this.gameStarting = false;
          })
          .catch(error => {
            console.error('Une erreur est survenue lors de la récupération des pays :', error);
            this.gameStarting = false;
          });
    },
    nextQuestion() {
      if (this.questionNumber < this.totalQuestions) {
        const randomIndex = Math.floor(Math.random() * this.countries.length);
        const country = this.countries[randomIndex];
        this.countryName = country.name.common;
        this.capital = country.capital[0] || 'N/A';
        this.flagUrl = country.flags.svg || 'N/A';
        this.mapLink = country.maps.googleMaps || '';
        this.userGuess = '';
        this.feedback = '';
        this.showCorrectAnswer = false;
        this.showNextQuestionButton = false;
        this.isAnswered = false;
        this.questionNumber++; // Incrémenter le compteur de questions
      } else {
        console.log('Fin de la partie');
      }
    },
    checkAnswer() {
      const userGuessTrimmed = this.userGuess.trim().toLowerCase();
      const capitalTrimmed = this.capital.toLowerCase();
      const commonLetters = this.getCommonLetters(userGuessTrimmed, capitalTrimmed);

      if (userGuessTrimmed === capitalTrimmed) {
        this.feedback = 'Correct!';
        this.score += 2;
        this.showCorrectAnswer = false;
        this.showNextQuestionButton = true;
      } else if (commonLetters.length / capitalTrimmed.length >= 0.7) {
        this.feedback = `Presque correct! La capitale est ${this.capital}.`;
        this.score += 1;
        this.showCorrectAnswer = true;

          this.showCorrectAnswer = false;
          this.showNextQuestionButton = true;

      } else {
        this.feedback = `Incorrect! La capitale est ${this.capital}.`;
        this.showNextQuestionButton = true;
      }
      this.isAnswered = true; // Mettre à jour l'état de la réponse validée
    },
    skipQuestion() {
      this.nextQuestion();
    },
    getCommonLetters(str1, str2) {
      const commonLetters = [];
      for (let char of str1) {
        if (str2.includes(char) && !commonLetters.includes(char)) {
          commonLetters.push(char);
        }
      }
      return commonLetters;
    },
    restartGame() {
      this.questionNumber = 0; // Réinitialise le compteur de questions à 0
      this.score = 0; // Réinitialise le score à 0
      this.nextQuestion(); // Commence le jeu avec la première question
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