<template>
    <div class="p-4 md:p-10 bg-neutral-100 relative"
      :style="boardBackground ? { backgroundImage: `url('${boardBackground}')`, backgroundSize: 'cover', backgroundPosition: 'top', backgroundRepeat: 'no-repeat' } : {}">
        <!-- Slot for all controls -->
        <div class="mt-[15%] md:mt-[4%] z-[120]">
          <slot name="controls"></slot>
        </div>
      
        <WishesBoard @onWishClick="handleWishClick" />
        <!-- Wish Mural -->
        <ModalWrapper v-if="selectedWish"
            :component="SingleWish"
            :componentProps="{ wish: selectedWish, editable: user?.uid === selectedWish.user || userRole === 'admin' }"
            @close="selectedWish = null"
            @edit="selectedWishToEdit = selectedWish; selectedWish = null"
            @remove="handleRemove"
        />

        <!-- Modal -->
        <ModalWrapper
            v-if="selectedWishToEdit"
            :component="WishForm"
            :componentProps="{ wishDoc: selectedWishToEdit }"
            @close="selectedWishToEdit = null"
            @save="selectedWishToEdit = null"
        />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWishlistStore } from '@/stores/wishListStore'
import useAuth from '@/composables/useAuth'
import WishesBoard from './WishesBoard.vue'
import SingleWish from './SingleWish.vue'
import ModalWrapper from './ModalWrapper.vue'
import WishForm from './WishForm.vue'
import { useGeneralCollectionStore } from '@/stores/generalDocsStore'


const generalStore = useGeneralCollectionStore()


const wishlistStore = useWishlistStore()
const { user, userRole } = useAuth()

const selectedWish = ref(null)
const selectedWishToEdit = ref(null)
const emit = defineEmits(['remove', 'openWish'])

// Set the current user in the store when component mounts
onMounted(() => {
})

const handleWishClick = (wish) => {
    selectedWish.value = wish
    console.log("handleOpenWish")
    emit('openWish', wish)
}

const handleRemove = async () => {

  emit('remove', selectedWish.value?.id);
  selectedWish.value = null
};


const VUE_APP_UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL
const boardBackground = computed(() => {
  const doc = generalStore?.document('wishes')
  const images = doc?.images_url || []
  const mainImg = images.find(img => img.role === 'main')
  return mainImg ? `${VUE_APP_UPLOAD_BASE_URL}${mainImg.url}` : ''
})
</script>
  