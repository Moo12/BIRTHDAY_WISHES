<template>
    <div class="signup-form">
      <h2>Sign Up</h2>
      <form @submit.prevent="signUp">
        <div>
          <label>Email:</label>
          <input type="email" v-model="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit">Sign Up</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
  
  // Firebase Auth instance
  const auth = getAuth()
  
  // Reactive state
  const email = ref('')
  const password = ref('')
  const error = ref(null)
  
  // Sign up function
  const signUp = async () => {
    error.value = null
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
      console.log('User signed up:', userCredential.user)
    } catch (err) {
      error.value = err.message
    }
  }
  </script>
  
  <style scoped>
  .signup-form {
    max-width: 400px;
    margin: auto;
    padding: 20px;
  }
  
  input {
    display: block;
    width: 100%;
    margin-top: 5px;
    margin-bottom: 15px;
    padding: 8px;
    font-size: 16px;
  }
  
  button {
    padding: 10px 20px;
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  