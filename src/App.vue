<template>
  <div class="" dir="rtl">
    <Navbar/>
  </div>
  <div class="my-4 md:my-6" dir="rtl">
    <router-view/>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
