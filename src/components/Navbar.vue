<template>
    <nav class="w-full px-4 py-3 bg-white shadow flex justify-between items-center">
      <div class="text-xl font-bold"></div>
      <div class="flex items-center gap-4">
            <router-link
                to="/"
                class="text-gray-700 font-bold hover:text-blue-500 py-1 px-2 border-b-2 border-transparent
                       router-link-exact-active:text-blue-700 router-link-exact-active:border-blue-500"
            >
            🎉 אלבום הברכות של אורלי           
            </router-link>

            <router-link
                v-if="user && userRole === 'admin'"
                to="/admin/user-view"
                class="text-purple-400 hover:text-purple-800 font-semibold py-1 px-2 border-b-2 border-transparent
                       router-link-active:text-red-800"
            >
            וUser View
            </router-link>
            <router-link
                v-if="user && userRole === 'admin'"
                to="/admin/images"
                class="text-purple-400 hover:text-purple-800 font-semibold py-1 px-2 border-b-2 border-transparent
                       router-link-active:text-red-800"
            >
site images maanager
            </router-link>
        </div>

  
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
  
  const { user, userRole, loginWithGoogle, logout } = useAuth()
  </script>
  