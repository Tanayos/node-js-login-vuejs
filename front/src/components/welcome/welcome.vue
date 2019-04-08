<template>
  <div id="welcome">
    <h1> The start is very hard </h1>
    <div class="cta" v-if="!loggedIn">
    <p>Start to the Login</p>
      <router-link to="/signup">Sign Up</router-link>
      <router-link to="/signin">Login</router-link>
    </div>
    <div class="cta" v-if="loggedIn">
      <p> Welcome the it took a while but you made it. Mohamed !!!!</p>
    </div>

  </div>
</template>

<script>
export default {
    computed : {
    loggedIn(){
      return this.$store.getters.loggedIn // permet de gerer les etat quands l'user et logger
    },
  }
}
</script>


<style scoped>
  #welcome {
    width: 80%;
    margin: auto;
  }

  h1 {
    text-align: center;
  }

  p {
    text-align: center;
  }

  .cta {
    width: 300px;
    margin: auto;
    text-align: center;
  }

  .cta a {
    margin: 10px;
    text-decoration: none;
    display: inline-block;
    border: 1px solid #521751;
    border-radius: 3px;
    width: 100px;
    padding: 10px;
    box-sizing: border-box;
    color: #521751;
  }

  .cta a:hover,
  .cta a:active {
    background-color: #521751;
    color: white;
  }
</style>