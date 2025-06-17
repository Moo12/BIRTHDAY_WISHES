<template>
    <div class="min-h-screen bg-neutral-100">
        <WishesWall @remove="onWishRemove" @openWish="onOpenWish">
            <template #controls>
                <div class="flex flex-col gap-4">
            
                    <div class="flex flex-col gap-4 mb-6">
                        <!-- Filter Buttons -->
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

                        <!-- Add Wish Button -->
                    </div>
                </div>
            </template>
        </WishesWall>
    </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import WishesWall from '@/components/WishesWall.vue'
import AddWish from '@/components/AddWish.vue'
import { useWishlistStore } from '@/stores/wishListStore'
import useAuth from '@/composables/useAuth'
import useDocument from '@/composables/useDocument'

const { _deleteDoc, _updateDoc } = useDocument("wishes")

const wishlistStore = useWishlistStore()
const { user } = useAuth()
const deleteStatus = ref('')
const searchName = ref('')

onUnmounted(() => {
    wishlistStore.setReadFilter('all')
    wishlistStore.setNameFilter('')
})

const filterButtonClass = (name) => {
    return [
      'px-4 py-2 rounded font-semibold transition',
      wishlistStore.currentReadFilter === name ? 'bg-teal-800 text-white' : 'bg-teal-100 hover:bg-teal-200'
    ]
  }

const handleNameSearch = () => {
    wishlistStore.setNameFilter(searchName.value)
}

const onOpenWish = (wish) => {
    console.log("onOpenWish", wish.metadata)
    
    _updateDoc({ metadata: { ...wish.metadata, read: true } }, wish.id)
}

const onAddWish = () => {
    // Handle wish added event if needed
    console.log('Wish added')
}

const onWishRemove = async (wishId) => {
  console.log("handleRemove", wishId);
  const success = await _deleteDoc(wishId);

  console.log("result", success)

  if (success) {
    deleteStatus.value = "האיחול נמחק בהצלחה 🗑️";
  } else {
    deleteStatus.value = "שגיאה במחיקת האיחול ❌";
  }

  setTimeout(() => {
    deleteStatus.value = "";

  },3000);
};
</script>
