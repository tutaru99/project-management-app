<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>Home Page View</h1>
    <h1>Project Management Application</h1>
    <HomeComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeComponent from '@/components/HomeComponent.vue'

export default {
  name: 'Home',
  components: {
    HomeComponent
  }
}
</script>
