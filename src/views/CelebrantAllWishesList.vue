<template>
    <div class="h-[90vh] relative">
        <!-- Fixed background layer -->
        <div 
        class="absolute top-0 left-0 w-full h-full bg-cover bg-top bg-no-repeat z-0 pointer-events-none"
        :style="{ backgroundImage: `url(${backgroundImageUrl})`}"
        ></div>
        <div class="absolute top-0 left-0 h-full w-full">
            <div class="w-[90%] mx-auto h-[90%] my-auto">
                <div v-if="isLoading">
                    <LoaderWrapper />
                </div>
                <div v-else class="relative z-10 px-[5%] pt-[5%] pb-[10%]">
                    <WishesGird @onOpenWish="onOpenWish">
                        <template #controls>
                            <div class="flex flex-col gap-4 mb-6 justify-center">
                                <div class="flex gap-2 justify-center flex-wrap">
                                    <button @click="wishlistStore.setReadFilter('read')" 
                                        :class="filterButtonClass('read')">נקראו</button>
                                    <button @click="wishlistStore.setReadFilter('unread')" 
                                        :class="filterButtonClass('unread')">לא נקראו</button>
                                    <button @click="wishlistStore.setReadFilter('all')" 
                                        :class="filterButtonClass('all')">הכל</button>
                                </div>
                
                                <!-- Name Search -->
                                <div class="flex justify-center">
                                    <input 
                                        type="text" 
                                        v-model="searchName" 
                                        @input="handleNameSearch"
                                        placeholder="חיפוש לפי שם..."
                                        class="px-4 py-2 rounded-md border border-purple-200 focus:outline-none focus:border-purple-400 w-full max-w-md"
                                    />
                                </div>
                            </div>
                        </template>
                    </WishesGird>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import WishesGird from '@/components/WishesGird.vue'
import LoaderWrapper from '@/components/LoaderWrapper.vue'
import { useWishlistStore } from '@/stores/wishListStore'
import { useGeneralCollectionStore } from '@/stores/generalDocsStore'
import useDocument from '@/composables/useDocument'

const { _updateDoc } = useDocument("wishes")

const wishlistStore = useWishlistStore()
const generalCollectionStore = useGeneralCollectionStore()

const VUE_APP_UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL

const backgroundImageUrl = ref('')

const searchName = ref('')

onMounted(() => {
    wishlistStore.setReadFilter('all')
    wishlistStore.setNameFilter('')

    const doc = generalCollectionStore?.document('wishes')
    const images = doc?.images_url || []
    
    // Get post background image
    const backgroundImage = images?.find(img => img?.role === 'main')
    if (backgroundImage?.url) {
        backgroundImageUrl.value = `${VUE_APP_UPLOAD_BASE_URL}${backgroundImage.url}`
    }
    console.log("backgroundImage", backgroundImageUrl.value)
})

onUnmounted(() => {
    wishlistStore.setReadFilter('all')
    wishlistStore.setNameFilter('')
})

const isLoading = computed(() => {
    if (wishlistStore && generalCollectionStore) {
        return wishlistStore.loading || generalCollectionStore.loading
    }
    return true
})

const filterButtonClass = (name) => {
    return [
      'px-4 py-2 rounded font-semibold transition',
      wishlistStore.currentReadFilter === name ? 'bg-teal-800 text-white' : 'bg-teal-100 hover:bg-teal-200'
    ]
  }

const onOpenWish = (wish) => {
    console.log("onOpenWish", wish)
    
    _updateDoc({ metadata: { ...wish.metadata, read: true } }, wish.id)
}

const handleNameSearch = () => {
    wishlistStore.setNameFilter(searchName.value)
}

</script>