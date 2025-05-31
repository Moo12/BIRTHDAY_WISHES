<template>
    <nav class="w-full px-4 py-3 bg-white shadow flex justify-between items-center">
      <div class="text-xl font-bold">🎉 My Wishes App</div>
  
      <div class="flex items-center gap-4">
        <div v-if="user">
          <span class="hidden sm:inline text-sm sm:text-base">שלום, {{ user.displayName }}</span>
          <button @click="logout"
                  class="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm sm:text-base">
            <LogOut class="w-5 h-5 sm:w-6 sm:h-6" />
            <span class="hidden sm:inline">התנתק</span>
          </button>
        </div>
        <div v-else>
          <button @click="loginWithGoogle"
                  class="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm sm:text-base">
            <LogIn class="w-5 h-5 sm:w-6 sm:h-6" />
            <span class="hidden sm:inline">התחבר</span>
          </button>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { LogIn, LogOut } from 'lucide-vue-next'
  import useAuth from '@/composables/useAuth'
  
  const { user, loginWithGoogle, logout } = useAuth()
  </script>
  