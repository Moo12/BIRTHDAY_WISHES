<template>
  <div class="w-full aspect-square rounded overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200" @click="$emit('open', wish.id)">
    <div :style="cardStyle" class="shadow-md p-4 w-full h-full rounded break-words flex flex-col justify-center items-center">
      <div class="m-[15%]" @click="$emit('open', wish.id)">
        <WishPosterContent :wish="wish" :maxChars="100" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGeneralCollectionStore } from '@/stores/generalDocsStore'
import WishPosterContent from './WishPosterContent.vue'

const props = defineProps({
  wish: {
    type: Object,
    required: true
  },
})

defineEmits(['open'])

const generalStore = useGeneralCollectionStore()
const VUE_APP_UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL

const wishCardBackground = computed(() => {
  const doc = generalStore?.document('wishes')
  const images = doc?.images_url || []
  const subImgs = images?.filter(img => img?.role === 'sub') || []

  if (!subImgs.length) return ''

  const randomIndex = Math.floor(Math.random() * subImgs.length)
  const subImg = subImgs[randomIndex]
  return subImg?.url ? `${VUE_APP_UPLOAD_BASE_URL}${subImg.url}` : ''
})

const colorOptions = ['#FEF08A', '#FDE68A', '#FECACA', '#A7F3D0']
const color = colorOptions[Math.floor(Math.random() * colorOptions.length)]

const randomStyle = computed(() => {
  const degs = [-2, -1, 1, 2]
  const rotate = degs[Math.floor(Math.random() * degs.length)]
  return {
    transform: `rotate(${rotate}deg)`
  }
})

const cardStyle = computed(() => {
  const base = wishCardBackground.value
    ? { backgroundImage: `url('${wishCardBackground.value}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
    : { backgroundColor: color }
  return { ...base, ...randomStyle.value, position: 'relative', zIndex: 2 }
})
</script>
  