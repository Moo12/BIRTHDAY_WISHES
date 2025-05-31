<template>
    <div v-if="!isLoading" class="">
        <div v-if="deleteStatus" class="text-center text-red-600 font-semibold my-4 mx-auto">
        {{ deleteStatus }}
        </div>

        <div v-for="wish in visibleWishes" :key=wish.id class="mx-20 mt-10 md:mx-40">
            <SingleWish :wish="wish" :editable="user?.uid === wish.user"  @remove="handleRemove" @edit="handleEdit"/>
        </div>
        <div v-if="currentEditedWishDoc" class="fixed inset-0 z-[10] w-full bg-white h-[60hv]" dir="rtl">
            <div class="relative w-[50%] mx-auto">
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
import getCollection from '@/composables/getCollection'
import useDocument from '@/composables/useDocument'
import useAuth from '@/composables/useAuth'

import SingleWish from './SingleWish.vue'
import WishForm from "./WishForm.vue"

const { documents, error, subscribeToCollection } = getCollection("wishes")
const { error : errorDocument, isPending : isPendingDocAction, _deleteDoc, _updateDoc } = useDocument("wishes");

const { user, userRole } = useAuth()

const deleteStatus = ref("")

const currentEditedWishDoc = ref(null)

subscribeToCollection()

const isLoading = computed(() => {
    if (!documents.value){
      return true
    }

    console.log(documents.value)

    return false
  })

const visibleWishes = computed(() => {
  if (!documents.value || !user.value) return [];

  // Admin and Celebrant can see all
  if (userRole.value === 'admin' || userRole.value === 'celebrant') {
    return documents.value;
  }

  // Regular user: own + public
  return documents.value.filter(doc =>
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

    currentEditedWishDoc.value = documents.value.find(item => item.id === id)

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