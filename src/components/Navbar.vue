<template>
  <div class="mx-auto h-full">

    <nav class="w-full h-full md:px-12 px-4  py-3 bg-white shadow flex justify-between items-center relative">
  
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
          v-if="userRole && userRole !== 'celebrant'"
          to="/add-wish"
          class="text-gray-700 font-bold hover:text-blue-500 py-1 px-2 border-b-2 border-transparent rounded transition-all"
          :class="$route.path === '/add-wish' ? 'bg-blue-100 text-blue-700 border-blue-500' : ''"
        >
          הוספת ברכה
        </router-link>
        <!-- Celebrant Wishes Dropdown -->
        <router-link
          v-if="userRole && (userRole === 'celebrant' || userRole === 'admin')"
          to="/celebrant/all-wishes-list"
          class="text-gray-700 font-bold hover:text-blue-500 py-1 px-2 border-b-2 border-transparent rounded transition-all"
          :class="{
            'bg-blue-100 text-blue-700 border-blue-500': $route.path.startsWith('/celebrant/'),
            'bg-transparent text-gray-700': !$route.path.startsWith('/celebrant/')
          }"
        >
          לוח ברכות
        </router-link>
        <router-link
          v-if="userRole && userRole !== 'celebrant'"
          to="/all-wishes"
          class="text-gray-700 font-bold hover:text-blue-500 py-1 px-2 border-b-2 border-transparent rounded transition-all"
          :class="$route.path === '/all-wishes' ? 'bg-blue-100 text-blue-700 border-blue-500' : ''"
        >
          כל הברכות
        </router-link>
        <!-- Admin Dropdown -->
        <div v-if="user && userRole === 'admin'" class="relative group">
          <button class="text-purple-400 hover:text-purple-800 font-semibold py-1 px-2 border-b-2 border-transparent flex items-center gap-1">
            Admin
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
            <div class="pt-2 pb-1">
              <div class="absolute -top-2 left-0 right-0 h-2"></div>
              <router-link
                to="/admin/images"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800"
                :class="$route.path === '/admin/images' ? 'bg-purple-100 text-purple-800' : ''"
              >
                Images Panel
              </router-link>
              <router-link
                to="/admin/all-wishes"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800"
                :class="$route.path === '/admin/all-wishes' ? 'bg-purple-100 text-purple-800' : ''"
              >
                All Wishes
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Centered Title -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span class="text-[14px] md:text-2xl font-extrabold text-gray-500 flex items-center gap-2">
          <span class="whitespace-nowrap">🎉 אלבום הברכות של אורלי ✨</span>
        </span>
      </div>

      <!-- Desktop Auth Buttons -->
      <div class="hidden md:flex items-center gap-4">
        <div v-if="user">
          <span class="hidden sm:inline text-sm sm:text-base">שלום, {{ user.displayName }}</span>
          <button @click="logout(); console.log('logout click')" class="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm sm:text-base">
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
      <button class="md:hidden flex items-center z-[100]" @click="mobileMenuOpen = true">
        <svg class="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </nav>

    <!-- Mobile Nav Overlay -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="mobileMenuOpen" class="fixed inset-0 bg-white z-[100] gap-8 text-xl">
          <div class="mt-[30%] flex flex-col items-center">
            <button class="absolute top-4 right-10 text-3xl" @click="mobileMenuOpen = false">✕</button>
            <div class="flex flex-col items-center gap-4">
              <router-link
                to="/home-page"
                class="w-3/4 text-center py-3 rounded font-bold border-b-2 border-transparent transition-all"
                :class="$route.path === '/home-page' ? 'bg-blue-100 text-blue-700 border-blue-500' : 'text-gray-700 hover:bg-blue-50'"
                @click="mobileMenuOpen = false"
              >
                דף הבית
              </router-link>
              <router-link
                v-if="userRole && userRole !== 'celebrant'"
                to="/add-wish"
                class="w-3/4 text-center py-3 rounded font-bold border-b-2 border-transparent transition-all"
                :class="$route.path === '/add-wish' ? 'bg-blue-100 text-blue-700 border-blue-500' : 'text-gray-700 hover:bg-blue-50'"
                @click="mobileMenuOpen = false"
              >
                הוספת ברכה
              </router-link>
              <!-- Celebrant Mobile Link -->
              <router-link
                v-if="userRole && (userRole === 'celebrant' || userRole === 'admin')"
                to="/celebrant/all-wishes-list"
                class="w-3/4 text-center py-3 rounded font-bold border-b-2 border-transparent transition-all"
                :class="$route.path === '/celebrant/all-wishes-list' ? 'bg-blue-100 text-blue-700 border-blue-500' : 'text-gray-700 hover:bg-blue-50'"
                @click="mobileMenuOpen = false"
              >
                לוח ברכות
              </router-link>
              <router-link
                v-if="userRole && userRole !== 'celebrant'"
                to="/all-wishes"
                class="w-3/4 text-center py-3 rounded font-bold border-b-2 border-transparent transition-all"
                :class="$route.path === '/all-wishes' ? 'bg-blue-100 text-blue-700 border-blue-500' : 'text-gray-700 hover:bg-blue-50'"
                @click="mobileMenuOpen = false"
              >
                כל הברכות
              </router-link>
              <div v-if="!user" class="flex flex-col items-center gap-2 w-3/4">
                <button
                  @click="openLoginModal"
                  class="w-full py-3 rounded font-bold bg-blue-500 text-white hover:bg-blue-600 transition-all"
                >
                  <span>התחבר</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { LogIn, LogOut } from 'lucide-vue-next'
import useAuth from '@/composables/useAuth'

const { user, userRole, loginWithGoogle, logout } = useAuth()
const mobileMenuOpen = ref(false)
const $route = useRoute()

const openLoginModal = () => {
  mobileMenuOpen.value = false
  loginWithGoogle()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
  