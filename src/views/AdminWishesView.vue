<template>
  <div v-if="isLoading" class="container mx-auto px-4 py-8">
    <LoaderWrapper />
  </div>
  <div v-else class="flex flex-col gap-6 mx-auto px-4 py-8">
    <!-- Statistics Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Wishes -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Wishes</h3>
        <p class="text-3xl font-bold text-purple-600">{{ totalWishes }}</p>
      </div>
      
      <!-- Total Users -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
        <p class="text-3xl font-bold text-purple-600">{{ totalUsers }}</p>
      </div>
      
      <!-- Users with Wishes -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Users with Wishes</h3>
        <p class="text-3xl font-bold text-purple-600">{{ usersWithWishes }}</p>
      </div>
    </div>

    <div>
      <button class="btn bg-green-600 px-4 py-2 rounded-lg text-white" @click="clearToUnreadWishes">
        Clear to UnRead Wishes
      </button>
    </div>




    <!-- Wishes List -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h2 class="text-2xl font-bold text-gray-800">All Wishes</h2>
      </div>
      <WishesList />
    </div>
  </div>
</template>

<script setup>
import { computed , onUnmounted, onMounted} from 'vue'
import { useWishlistStore } from '@/stores/wishListStore'
import WishesList from '@/components/WishesList.vue'
import useFirestoreCollection from '@/composables/getCollection'
import LoaderWrapper from '@/components/LoaderWrapper.vue'
import useDocument from '@/composables/useDocument'

const { _updateDoc } = useDocument("wishes")

const wishlistStore = useWishlistStore()
const {
    documents: users,
    subscribeToCollection,
    unsubscribe,
  } = useFirestoreCollection()
  


onMounted(() => {
  subscribeToCollection('users')
  wishlistStore.setReadFilter('all')
  wishlistStore.setFilter('all')
})


// Statistics
const totalWishes = computed(() => wishlistStore.documents?.length || 0)
const totalUsers = computed(() => users?.value?.length || 0)
const usersWithWishes = computed(() => {
  if (!wishlistStore.documents || !users?.value) return 0
  const usersWithWishesSet = new Set(wishlistStore.documents?.map(wish => wish.user))
  return usersWithWishesSet.size
})

const isLoading = computed(() => {
    if (wishlistStore) {
        return wishlistStore.loading
    }

    return true
})

onUnmounted(() => {
  unsubscribe()
})

const clearToUnreadWishes = async () => {
  
  wishlistStore.documents.forEach(async (wish) => {
    
    await _updateDoc({ metadata: { ...wish.metadata, read: false } }, wish.id)
  })
}
</script> 