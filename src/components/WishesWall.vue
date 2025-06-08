<template>
    <div class="p-4 md:p-10 bg-neutral-100 min-h-screen">
      <div v-if="deleteStatus" class="text-center text-red-600 font-semibold my-4 mx-auto">
        {{ deleteStatus }}
        </div>
  
      <!-- Filter Row -->
      <div class="mx-auto flex flex-col gap-2 mb-6 justify-center items-center">
        <div class="flex items-center gap-2">
          <label for="nameFilter" class="font-semibold">שם:</label>
          <input
            id="nameFilter"
            v-model="nameFilter"
            type="text"
            placeholder="חפש.י לפי שם..."
            class="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div class="gap-4 flex items-center justify-between">
          <button @click="filter = 'all'" :class="filterButtonClass('all')">כל הברכות</button>
          <button @click="filter = 'mine'" :class="filterButtonClass('mine')">שלי</button>
        </div>
      </div>
  
      <!-- Wish Mural -->
      <div class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center">
        <div v-for="wish in visibleWishes" :key="wish.id">
          <WishPoster
            :wish="wish"
            :isMine="user?.uid === wish.user"
            @open="handleOpenWish(wish)"
            />
            <ModalWrapper v-if="selectedWish"
              :component="SingleWishWallStyle"
              :componentProps="{ wish: selectedWish, editable: user?.uid === selectedWish.user }"
              @close="selectedWish = null"
              @edit="selectedWishToEdit = wish; selectedWish = null; console.log('edit wishes wall', selectedWishToEdit)"
              @remove="handleRemove(wish.id)"
            />
        </div>
      </div>
  

      <!-- Modal -->
      <ModalWrapper
        v-if="selectedWishToEdit"
        :component="WishForm"
        :componentProps="{ wishDoc: selectedWishToEdit }"
        @close="selectedWishToEdit = null"
      />
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'
  import WishPoster from './WishPoster.vue'
  import { useWishlistStore } from '@/stores/wishListStore'
  import useAuth from '@/composables/useAuth'
  import useDocument from '@/composables/useDocument'
  import ModalWrapper from '@/components/ModalWrapper.vue'
  import SingleWishWallStyle from '@/components/SingleWishWallStyle.vue'
  import WishForm from '@/components/WishForm.vue'
  
  const { error : errorDocument, isPending : isPendingDocAction, _deleteDoc } = useDocument("wishes");
  
  const { user, userRole } = useAuth()
  const wishlistStore = useWishlistStore()
  
  const filter = ref('all')

  const selectedWish = ref(null)
  const selectedWishToEdit = ref(null)

  const deleteStatus = ref('')

  const nameFilter = ref("")
  
  const visibleWishes = computed(() => {
    if (!wishlistStore.documents || !user.value) return []
    let filtered = wishlistStore.documents

    // Filter by button (all/mine)
    if (filter.value === 'mine') {
      filtered = filtered.filter(doc => doc.user === user.value.uid)
    } else if (filter.value === 'public') {
      filtered = filtered.filter(doc => doc.public === true)
    } else {
      // 'all': show own + public
      filtered = filtered.filter(doc => doc.user === user.value.uid || doc.public === true)
    }

    // Filter by name
    if (nameFilter.value && nameFilter.value.trim() !== "") {
      const search = nameFilter.value.trim().toLowerCase()
      filtered = filtered.filter(doc => (doc.name || "").toLowerCase().includes(search))
    }

    return filtered
  })
  
  const filterButtonClass = (name) => {
    return [
      'px-4 py-2 rounded font-semibold transition',
      filter.value === name ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
    ]
  }
  
  const handleOpenWish = (id) => {
    console.log('Open wish:', id)
    selectedWish.value = id
    // optional modal or expand action
  }

const handleRemove = async (id) => {
  console.log("handleRemove", id);
  const success = await _deleteDoc(id);

  console.log("result", success)

  selectedWish.value = null
  if (success) {
    deleteStatus.value = "האיחול נמחק בהצלחה 🗑️";
  } else {
    deleteStatus.value = "שגיאה במחיקת האיחול ❌";
  }

  setTimeout(() => {
    deleteStatus.value = "";

  }, 3000);
};
  </script>
  