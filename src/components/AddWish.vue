<template>
  <div class="flex flex-col items-center justify-center gap-4 z-[9]">
    <div class="relative inline-block">
      <button v-if="userRole"
        class="add-wish-btn"
        @click="isCreateWish = true"
        :disabled="userNumberOfWishes === maxWishes && userRole !== 'admin'"
        @mouseenter="isHoveredAndDisabled = userNumberOfWishes === maxWishes && userRole !== 'admin'"
        @mouseleave="isHoveredAndDisabled = false"
        :style="buttonStyles" >
        <p class="text-[26px] font-semibold px-4 py-2">{{ buttonText }}</p>
      </button>
      <div
        v-if="isHoveredAndDisabled"
        class="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white p-2 text-sm text-gray-700 rounded shadow-md border border-gray-300 whitespace-nowrap"
      >
        הגעת למספר הברכות המקסימלי
      </div>
    </div>
    <div v-if="createStatus" class="text-center text-white font-semibold my-4 mx-auto">
      {{ createStatus }}
    </div>
    <ModalWrapper
      v-if="isCreateWish"
      :component="WishForm"
      @close="isCreateWish = false"
      @save="handleImageSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useWishlistStore } from '@/stores/wishListStore'
import useAuth from '@/composables/useAuth'
import ModalWrapper from '@/components/ModalWrapper.vue'
import WishForm from '@/components/WishForm.vue'

const { userRole } = useAuth()

// Define color palettes
const colorPalettes = {
  pink: {
    light: '#fadadd', // Light pink
    dark: '#702963'  // Dark pink/purple
  },
  blue: {
    light: '#e0f2fe', // Light blue (e.g., from Tailwind's blue-100)
    dark: '#1e40af'  // Dark blue (e.g., from Tailwind's blue-800)
  },
  green: {
    light: '#d1fae5', // Light green (e.g., from Tailwind's green-100)
    dark: '#065f46'  // Dark green (e.g., from Tailwind's green-800)
  },
  yellow: {
    light: '#fefce8', // Light yellow (e.g., from Tailwind's yellow-100)
    dark: '#854d0e'  // Dark yellow (e.g., from Tailwind's yellow-800)
  },
  purple: {
    light: '#f5f3ff', // Light purple (e.g., from Tailwind's purple-100)
    dark: '#4f46e5'  // Dark purple (e.g., from Tailwind's purple-800)
  },
  red: {
    light: '#fee2e2', // Light red (e.g., from Tailwind's red-100)
    dark: '#991b1b'  // Dark red (e.g., from Tailwind's red-800)
  },
  teal: {
    light: '#d1fae5', // Light teal (e.g., from Tailwind's teal-100)
    dark: '#0D9488'  // Dark teal (e.g., from Tailwind's teal-600)
  }
};

const props = defineProps({
  buttonText: { type: String, default: 'הוסף.הוסיפי ברכה ✨' },
  maxWishes: { type: Number, default: null },
  // New props for color customization
  colorScheme: {
    type: String,
    default: 'pink', // Options: 'pink', 'blue', 'green'
    validator: (value) => ['pink', 'blue', 'green', 'yellow', 'purple', 'red', 'teal'].includes(value)
  },
  hoverEffect: {
    type: String,
    default: 'light-to-dark', // Options: 'light-to-dark', 'dark-to-light'
    validator: (value) => ['light-to-dark', 'dark-to-light'].includes(value)
  }
})

const emit = defineEmits(['wish-added'])

const isHoveredAndDisabled = ref(false)
const isCreateWish = ref(false)
const createStatus = ref("")

const { user } = useAuth()
const configStore = useConfigStore()
const wishlistStore = useWishlistStore()


// Computed property to generate dynamic CSS variables for the button
const buttonStyles = computed(() => {
  const scheme = colorPalettes[props.colorScheme];
  let bgColor, textColor, hoverBgColor, hoverTextColor;

  if (props.hoverEffect === 'light-to-dark') {
    // Default (e.g., pink scheme): light background, dark text -> hover to dark background, light text
    bgColor = scheme.light;
    textColor = scheme.dark;
    hoverBgColor = scheme.dark;
    hoverTextColor = scheme.light;
  } else { // 'dark-to-light'
    // Dark background, light text -> hover to light background, dark text
    bgColor = scheme.dark;
    textColor = scheme.light;
    hoverBgColor = scheme.light;
    hoverTextColor = scheme.dark;
  }

  return {
    '--btn-bg': bgColor,
    '--btn-text': textColor,
    '--btn-hover-bg': hoverBgColor,
    '--btn-hover-text': hoverTextColor
  };
});


const userNumberOfWishes = computed(() => {
  const userWishes = wishlistStore.documents?.filter(item => item.user === user.value?.uid)
  return userWishes?.length || 0
})

const maxWishes = computed(() => props.maxWishes ?? configStore.maxWishesPerUser)

function handleImageSave(status) {
  if (status === 'success') {
    createStatus.value = 'האיחול נוסף בהצלחה'
    isCreateWish.value = false
    emit('wish-added')
  } else if (status === 'cancel') {
    createStatus.value = ''
    isCreateWish.value = false
  } else if (status === 'failure') {
    createStatus.value = 'שגיאה נקרתה בזמן הוספת הברכה'
  }
  setTimeout(() => {
    createStatus.value = ''
  }, 3000)
}
</script>

<style scoped>
.add-wish-btn {
  /* Use CSS variables defined in the script */
  background-color: var(--btn-bg);
  color: var(--btn-text);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  /* Add background-color and color to transition for smooth hover effect */
  transition: transform 0.2s ease-in-out, background-color 0.2s, color 0.2s;
  animation: soft-pulse 1.5s infinite;
  border-radius: 5px;
}
.add-wish-btn:hover {
  animation: none;
  transform: scale(1.1);
  opacity: 0.9; /* A bit more subtle than 0.7 for a hover effect */
  background-color: var(--btn-hover-bg);
  color: var(--btn-hover-text);
}
@keyframes soft-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>