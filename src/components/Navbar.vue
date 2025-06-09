<template>
  <div class="mx-auto">

    <nav class="w-full md:px-12 px-4  py-3 bg-white shadow flex justify-between items-center relative">
  
      <!-- Desktop Nav Links -->
      <div class="hidden md:flex items-center gap-4">
        <router-link
          to="/home-page"
          class="text-gray-700 font-bold hover:text-blue-500 py-1 px-2 border-b-2 border-transparent rounded transition-all"
          :class="$route.path === '/home-page' ? 'bg-blue-100 text-blue-700 border-blue-500' : ''"
          exact
        >
          דף הבית
        </router-link>
        <router-link
        to="/add-wish"
        class="text-gray-700 font-bold hover:text-blue-500 py-1 px-2 border-b-2 border-transparent rounded transition-all"
        :class="$route.path === '/add-wish' ? 'bg-blue-100 text-blue-700 border-blue-500' : ''"
        >
        הוסף ברכה
      </router-link>
      <router-link
        to="/all-wishes"
        class="text-gray-700 font-bold hover:text-blue-500 py-1 px-2 border-b-2 border-transparent rounded transition-all"
        :class="$route.path === '/all-wishes' ? 'bg-blue-100 text-blue-700 border-blue-500' : ''"
      >
        כל הברכות
      </router-link>
        <router-link
          v-if="user && userRole === 'admin'"
          to="/admin/images"
          class="text-purple-400 hover:text-purple-800 font-semibold py-1 px-2 border-b-2 border-transparent router-link-exact-active:text-purple-800"
          exact
        >
          Images Panel
        </router-link>
      </div>

      <!-- Centered Title -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span class="text-[14px] md:text-2xl font-extrabold text-gray-500 flex items-center gap-2">
          🎉 אלבום הברכות של אורלי ✨
        </span>
      </div>

      <!-- Desktop Auth Buttons -->
      <div class="hidden md:flex items-center gap-4">
        <div v-if="user">
          <span class="hidden sm:inline text-sm sm:text-base">שלום, {{ user.displayName }}</span>
          <button @click="logout" class="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm sm:text-base">
            <LogOut class="w-5 h-5 sm:w-6 sm:h-6" />
            <span class="hidden sm:inline">התנתק</span>
          </button>
        </div>
        <div v-else>
          <button @click="loginWithGoogle" class="btn flex items-center gap-1 text-blue-500 hover:text-blue-700 text-sm sm:text-base">
            <LogIn class="w-5 h-5 sm:w-6 sm:h-6" />
            <span class="hidden sm:inline">התחבר</span>
          </button>
        </div>
      </div>
  
      <!-- Hamburger Button (Mobile) -->
      <button class="md:hidden flex items-center z-[10]" @click="mobileMenuOpen = true">
        <svg class="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
  
      <!-- Mobile Nav Overlay -->
      <transition name="fade">
        <div v-if="mobileMenuOpen" class="fixed inset-0 bg-white z-[10]  gap-8 text-xl">
          <div class="mt-[30%] flex flex-col items-center">

            <button class="absolute top-4 right-10 text-3xl" @click="mobileMenuOpen = false">✕</button>
            <router-link
              to="/home-page"
              class="w-3/4 text-center py-3 rounded font-bold border-b-2 border-transparent transition-all"
              :class="$route.path === '/home-page' ? 'bg-blue-100 text-blue-700 border-blue-500' : 'text-gray-700 hover:bg-blue-50'"
              @click="mobileMenuOpen = false"
              exact
            >
              דף הבית
            </router-link>
            
            
            <router-link
            to="/add-wish"
            class="w-3/4 text-center py-3 rounded font-bold border-b-2 border-transparent transition-all"
            :class="$route.path === '/add-wish' ? 'bg-blue-100 text-blue-700 border-blue-500' : 'text-gray-700 hover:bg-blue-50'"
            @click="mobileMenuOpen = false"
            >
            הוסף ברכה
          </router-link>
          <router-link
            to="/all-wishes"
            class="w-3/4 text-center py-3 rounded font-bold border-b-2 border-transparent transition-all"
            :class="$route.path === '/all-wishes' ? 'bg-blue-100 text-blue-700 border-blue-500' : 'text-gray-700 hover:bg-blue-50'"
            @click="mobileMenuOpen = false"
          >
            כל הברכות
          </router-link>
          <router-link
          v-if="user && userRole === 'admin'"
          to="/admin/images"
          class="w-3/4 text-center py-3 rounded font-semibold border-b-2 border-transparent transition-all"
          :class="$route.path === '/admin/images' ? 'bg-purple-100 text-purple-800 border-purple-800' : 'text-purple-400 hover:bg-purple-50'"
          @click="mobileMenuOpen = false"
          exact
          >
          Images Panel
        </router-link>
          <div class="w-3/4 flex flex-col gap-4 mt-4">
            <div v-if="user">
              <span class="block text-center text-base mb-2">שלום, {{ user.displayName }}</span>
              <button @click="logout; mobileMenuOpen = false" class="w-full flex items-center justify-center gap-1 text-red-500 hover:text-red-700 text-base py-2">
                <LogOut class="w-5 h-5" />
                <span>התנתק</span>
              </button>
            </div>
            <div v-else>
                <button @click="loginWithGoogle; mobileMenuOpen = false" class="w-full flex items-center justify-center gap-1 text-blue-500 hover:text-blue-700 text-base py-2">
                  <LogIn class="w-5 h-5" />
                  <span>התחבר</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { LogIn, LogOut } from 'lucide-vue-next'
import useAuth from '@/composables/useAuth'

const { user, userRole, loginWithGoogle, logout } = useAuth()
const mobileMenuOpen = ref(false)
const $route = useRoute()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
  