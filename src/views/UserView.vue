<template>
    <div class="bg-neutral-100 h-full w-full">
        <WishesWall @remove="onWishRemove" @open="onWishOpen" class="h-full w-full">
            <template #controls>
                <div class="flex flex-col gap-4">
                    <div class="flex justify-center">
                        <AddWish @wish-added="onAddWish" colorScheme="teal" hoverEffect="dark-to-light" />
                    </div>
            
                    <!-- Delete Status -->
                    <div v-if="deleteStatus" class="text-center text-red-600 font-semibold my-4 mx-auto">
                        {{ deleteStatus }}
                    </div>
                    <div class="flex flex-col gap-4 mb-6">
                        <!-- Filter Buttons -->
                        <div class="flex gap-2 justify-center flex-wrap">
                            <button @click="wishlistStore.setFilter('all')" 
                                :class="filterButtonClass('all')">כל הברכות</button>
                            <button @click="wishlistStore.setFilter('mine')" 
                                :class="filterButtonClass('mine')">שלי</button>
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
import { ref, onMounted } from 'vue'
import WishesWall from '@/components/WishesWall.vue'
import AddWish from '@/components/AddWish.vue'
import { useWishlistStore } from '@/stores/wishListStore'
import useAuth from '@/composables/useAuth'
import useDocument from '@/composables/useDocument'

const { _deleteDoc } = useDocument("wishes")

const wishlistStore = useWishlistStore()
const { user } = useAuth()
const deleteStatus = ref('')
const searchName = ref('')

// Set the current user in the store when component mounts
onMounted(() => {
    wishlistStore.setUserUid(user.value?.uid || null)

    wishlistStore.setFilter('public')
})

const filterButtonClass = (name) => {
    return [
      'px-4 py-2 rounded font-semibold transition',
      wishlistStore.currentFilter === name ? 'bg-teal-800 text-white' : 'bg-teal-100 hover:bg-teal-200'
    ]
  }

const handleNameSearch = () => {
    wishlistStore.setNameFilter(searchName.value)
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
