<script>
</script>

<template>
  <div id="home">
    <h1>Bienvenue sur notre application de quiz sur les capitales!</h1>
    <p>Choisissez ce que vous voulez faire:</p>
    <RouterLink to="/quiz">
      <button>Commencer le quiz</button>
    </RouterLink>
  </div>

  <RouterView></RouterView>
</template>


<style scoped>
#home {
  text-align: center;
  margin-top: 100px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
