<template>
  <div id="dashboard">
    <h1>That's the dashboard! {{name}}</h1>
    <p>You should only get here if you're authenticated!</p>
    <p>Your email address: {{ email }}</p>
  </div>
</template>

<script>
  import axios from 'axios';
  import {mapState} from 'vuex'

  export default {
    computed : mapState([
        'email',
        'name'
      ]),
    created () {


    }
  }
</script>

<style scoped>
  h1, p {
    text-align: center;
  }

  p {
    color: red;
  }
</style>