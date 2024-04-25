<template>
  <div id="quiz-page">
    <div v-if="gameStarted">
      <p>Question {{ questionNumber }} / {{ totalQuestions }}</p>
      <p><button @click="restartGame">Recommencer</button></p>
      <img :src="flagUrl" alt="Drapeau" style="max-width: 300px;">
      <p>{{ countryName }}</p>
      <a :href="mapLink" target="_blank">Voir sur Google Maps</a>
      <p>{{ question }}</p>
      <div v-if="!isAnswered">
        <div v-for="(option, index) in options" :key="index">
          <button @click="checkAnswer(option)" :disabled="isAnswered">{{ option }}</button>
        </div>
      </div>
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
      mapLink: '',
      options: [],
      userGuess: '',
      feedback: '',
      score: 0,
      question: "Quelle est la capitale de ce pays ?",
      showCorrectAnswer: false,
      showNextQuestionButton: false,
      isAnswered: false,
      questionNumber: 0,
      totalQuestions: 20
    }
  },
  mounted() {
    this.startGame();
  },
  methods: {
    startGame() {
      this.gameStarted = true;
      fetch('https://restcountries.com/v3.1/all')
          .then(response => response.json())
          .then(data => {
            this.countries = data;
            this.nextQuestion();
          })
          .catch(error => {
            console.error('Une erreur est survenue lors de la récupération des pays :', error);
            this.gameStarted = false;
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
        this.questionNumber++;
        this.options = this.generateOptions(this.capital, this.countries);
      } else {
        console.log('Fin de la partie');
      }
    },
    checkAnswer(selectedOption) {
      const capitalTrimmed = this.capital.toLowerCase();
      if (selectedOption.toLowerCase() === capitalTrimmed) {
        this.feedback = 'Correct!';
        this.score += 2;
        this.showCorrectAnswer = false;
        this.showNextQuestionButton = true;
      } else {
        this.feedback = `Incorrect! La capitale est ${this.capital}.`;
        this.showCorrectAnswer = true;
        this.showNextQuestionButton = true;
      }
      this.isAnswered = true;
    },
    generateOptions(correctAnswer, countries) {
      let options = new Set();
      options.add(correctAnswer);
      while (options.size < 5) {
        const randomCountry = countries[Math.floor(Math.random() * countries.length)];
        const wrongAnswer = randomCountry.capital[0] || 'N/A';
        if (wrongAnswer !== correctAnswer) {
          options.add(wrongAnswer);
        }
      }
      return [...options].sort(() => Math.random() - 0.5);
    },
    restartGame() {
      this.questionNumber = 0;
      this.score = 0;
      this.nextQuestion();
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
