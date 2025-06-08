<template>
  <div class="min-h-[90vh] flex items-center justify-center bg-neutral-100"
    :style="backgroundImage ? { backgroundImage: `url('${backgroundImage}')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } : {}">
    <div class="min-h-[90vh] flex flex-col items-center justify-between mx-[10%] py-10">
      <div class="mx-auto md:text-[56px] text-[32px] font-black leading-none">
        <p>כאן כותבים ברכה</p>
      </div>
      <div class="relative">
        <img :src="wishCardBackground" alt="" class="object-cover h-auto">
        <div class="w-4/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <p class=" md:text-[22px] text-[18px] font-semibold whitespace-pre-line break-words text-center leading-relaxed">
אורלי חוגגת 70, ואנחנו יוצרים לה אתר מלא ברכות וזיכרונות מכל החברים והמשפחה.
נשמח אם תכתבו כאן ברכה מרגשת, מצחיקה, סיפור משותף או כל מה שעולה לכם, וגם תמונות יתקבלו בברכה.
תוכלו לבחור אם הברכה שלכם תישמר אישית או שתהיה פומבית וכולם יוכלו לצפות בה.
הברכות ייאספו ויאוגדו באתר שיישאר לה למזכרת 
          </p>
        </div>
      </div>
      <button
        class="add-wish-btn  px-8 py-4 rounded-xl font-bold text-lg md:text-2xl shadow-lg border-2 border-purple-400 bg-purple-100 text-purple-700 focus:outline-none"
        @click="isModalOpen = true"
      >
        הוסף ברכה חדשה ✨
      </button>
      <!-- Centered Animated Button -->
      <!-- Modal -->
    </div>
    <ModalWrapper v-if="isModalOpen" :component="WishForm" @close="isModalOpen = false" @save="handleSave" />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import ModalWrapper from '@/components/ModalWrapper.vue'
import WishForm from '@/components/WishForm.vue'
import { useGeneralCollectionStore } from '@/stores/generalDocsStore'

const isModalOpen = ref(false)
const router = useRouter()

const generalStore = useGeneralCollectionStore()

const VUE_APP_UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL

const backgroundImage = ref("")
const wishCardBackground = ref("")

watchEffect(() => {
  const doc = generalStore?.document('add-wish')
  const images = doc?.images_url || []
  // Find by role
  const mainImg = images.find(img => img.role === 'main')
  const subImg = images.find(img => img.role === 'sub')
  backgroundImage.value = mainImg ? `${VUE_APP_UPLOAD_BASE_URL}${mainImg.url}` : ''
  wishCardBackground.value = subImg ? `${VUE_APP_UPLOAD_BASE_URL}${subImg.url}` : ''
})

function handleSave(status) {
  console.log("handle save", status)
  if (status === 'success') {
    isModalOpen.value = false
    router.push('/all-wishes')
  }
}
</script>

<style scoped>

.add-wish-btn {
  animation: soft-pulse 1.5s infinite;
  transition: transform 0.2s;
}
.add-wish-btn:hover {
  animation: none;
  transform: scale(1.08);
  opacity: 0.8;
}
@keyframes soft-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style> 