<template>
  <div class="flex flex-col items-center justify-center gap-4 z-[9]">
    <div class="relative inline-block">
      <button
        class="add-wish-btn"
        @click="isCreateWish = true"
        :disabled="userNumberOfWishes === maxWishes"
        @mouseenter="isHoveredAndDisabled = userNumberOfWishes === maxWishes"
        @mouseleave="isHoveredAndDisabled = false"
      >
        <p class="text-[26px] font-semibold px-4 py-2">{{ buttonText }}</p>
      </button>
      <div
        v-if="isHoveredAndDisabled"
        class="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white p-2 text-sm text-gray-700 rounded shadow-md border border-gray-300 whitespace-nowrap"
      >
        הגעת למספר הברכות המקסימלי
      </div>
    </div>
    <div>
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

const props = defineProps({
  buttonText: { type: String, default: 'הוסף.הוסיפי ברכה ✨' },
  maxWishes: { type: Number, default: null },
})

const emit = defineEmits(['wish-added'])

const isHoveredAndDisabled = ref(false)
const isCreateWish = ref(false)
const createStatus = ref("")

const { user } = useAuth()
const configStore = useConfigStore()
const wishlistStore = useWishlistStore()

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
  background-color: #fadadd;
  color: #702963;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s ease-in-out;
  animation: soft-pulse 1.5s infinite;
  transition: transform 0.2s;
  border-radius: 5px;
}
.add-wish-btn:hover {
  animation: none;
  transform: scale(1.1);
  opacity: 0.7;
  background-color: #702963;
  color: #fadadd;
}
@keyframes soft-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style> 