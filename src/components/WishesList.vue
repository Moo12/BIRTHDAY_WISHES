<template>
    <div v-if="!wishlistStore.loading" class="">
        <div v-if="deleteStatus" class="text-center text-red-600 font-semibold my-4 mx-auto">
        {{ deleteStatus }}
        </div>

        <div v-for="wish in visibleWishes" :key=wish.id class="mx-20 mt-10 md:mx-40">
            <SingleWish :wish="wish" :editable="user?.uid === wish.user"  @remove="handleRemove" @edit="handleEdit"/>
        </div>
        <div v-if="currentEditedWishDoc" class="fixed inset-0 z-[10] w-full bg-white h-[60hv]" dir="rtl">
            <div class="relative w-[90%] md:w-[60%] mx-auto">
                <WishForm @save="handleSave" :wishDoc="currentEditedWishDoc"/>
            </div>
        </div>
    </div>
    <div v-else>
        Loading
    </div>

</template>

<script setup>
import { computed, ref } from "vue"
import useDocument from '@/composables/useDocument'
import useAuth from '@/composables/useAuth'
import { useWishlistStore } from '@/stores/wishListStore'

import SingleWish from './SingleWish.vue'
import WishForm from "./WishForm.vue"

const { error : errorDocument, isPending : isPendingDocAction, _deleteDoc } = useDocument("wishes");

const { user, userRole } = useAuth()

const wishlistStore = useWishlistStore()

const deleteStatus = ref("")

const currentEditedWishDoc = ref(null)

const visibleWishes = computed(() => {
  if (!wishlistStore.documents || !user.value) return [];

  // Admin and Celebrant can see all
  if (userRole.value === 'admin' || userRole.value === 'celebrant') {
    return wishlistStore.documents;
  }

  // Regular user: own + public
  return wishlistStore.documents.filter(doc =>
    doc.user === user.value.uid || doc.public === true
  );
});

const handleRemove = async (id) => {
  console.log("handleRemove", id);
  const success = await _deleteDoc(id);

  console.log("result", success)

  if (success) {
    deleteStatus.value = "האיחול נמחק בהצלחה 🗑️";
  } else {
    deleteStatus.value = "שגיאה במחיקת האיחול ❌";
  }

  setTimeout(() => {
    deleteStatus.value = "";
  }, 3000);
};

const handleEdit = (id) => {
    console.log("handleEdit", id)

    currentEditedWishDoc.value = wishlistStore.documents.find(item => item.id === id)

    console.log("edited wish", currentEditedWishDoc.value)
}

const handleSave = (status ) => {
    console.log("handleSave", status)

    if (status === "success" || status === "cancel"){
        currentEditedWishDoc.value = null
    }
    else{
        console.error("error update doc")
    }
}

</script>