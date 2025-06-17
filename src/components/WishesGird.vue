<template>
    <div class="relative h-full bg-cover bg-center bg-no-repeat">
        <div class="mt-[15%] md:mt-[4%]">
          <slot name="controls"></slot>
        </div>
      
        <div class="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5 flex-grow overflow-y-auto min-h-0 max-h-[60vh]">
            <div v-for="wish in wishlistStore.visibleWishes" :key="wish.id" @click="emit('onOpenWish', wish); selectedWish = wish"
                class="btn overflow-hidden rounded-lg relative">
                <!-- Background image -->
                <img
                :src="backgroundImage"
                alt="background"
                class="w-full h-auto  object-contain"
                />
                <div class="h-full absolute inset-0 z-[10] ">
                    <div class="w-[70%] mx-auto py-[10%]">
                        <WishPosterContent :wish="wish" :displayRead="true" :nameTextSize="nameTextSize" 
                        :previewTextSize="previewTextSize" :charsDisplay="80"/>
                    </div>
                </div>
            </div>
        </div>
        <ModalWrapper v-if="selectedWish"
            :component="SingleWish"
            :componentProps="{ wish: selectedWish, editable: false, is_date: false, is_public: false, border: false }"
            :backgroundImageUrl="openPostBackgroundImage"
            @close="selectedWish = null"
        />
    </div>
</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useWishlistStore } from '@/stores/wishListStore'
import WishPosterContent from './WishPosterContent.vue'
import { useGeneralCollectionStore } from '@/stores/generalDocsStore'
import ModalWrapper from './ModalWrapper.vue'
import SingleWish from './SingleWish.vue'

const selectedWish = ref(null)

const wishlistStore = useWishlistStore()

const VUE_APP_UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL
const generalStore = useGeneralCollectionStore()

const emit = defineEmits(["onOpenWish"])

const backgroundImage = ref('')
const openPostBackgroundImage = ref('')
const albumBackgroundImage = ref(null)

onMounted(() => {
    console.log("onMounted")

    const doc = generalStore?.document('wishes')
    const images = doc?.images_url || []
    
    // Get post background image
    const postBackground = images?.find(img => img?.role === 'post_background')
    if (postBackground?.url) {
        backgroundImage.value = `${VUE_APP_UPLOAD_BASE_URL}${postBackground.url}`
    }
    console.log("backgroundImage", backgroundImage.value)

    const openPostBackground = images?.find(img => img?.role === 'open_wish_background')
    if (openPostBackground?.url) {
        openPostBackgroundImage.value = `${VUE_APP_UPLOAD_BASE_URL}${openPostBackground.url}`
    }
    console.log("backgroundImage", backgroundImage.value)

    // Get album background image
    const albumBackground = images?.find(img => img?.role === 'album_background')
    if (albumBackground?.url) {
        albumBackgroundImage.value = `${VUE_APP_UPLOAD_BASE_URL}${albumBackground.url}`
    }
    console.log("albumBackgroundImage", albumBackgroundImage.value)
})

const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const nameTextSize = computed(() => {
  return isMobile.value ? 'text-[20px]' : window.innerWidth < 1300 ? 'text-[24px]' : 'text-[28px]'
})

const previewTextSize = computed(() => {
  return isMobile.value ? 'text-[14px]' : window.innerWidth < 1300 ? 'text-[16px]' : 'text-[18px]' 
})

</script>