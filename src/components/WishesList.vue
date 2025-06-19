<template>
    <div v-if="!wishlistStore.loading" class="">
        <div>
          <slot name="controls"></slot>
        </div>

        <div v-for="wish in wishlistStore.visibleWishes" :key=wish.id class="mx-20 mt-10 md:mx-40">
            <SingleWish 
              :wish="wish" 
              :editable="false"
              @remove="handleRemove" 
              @edit="handleEdit"
            />
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
import { useWishlistStore } from '@/stores/wishListStore'

import SingleWish from './SingleWish.vue'
import WishForm from "./WishForm.vue"

const emit = defineEmits(['onOpenWish'])

const { error : errorDocument, isPending : isPendingDocAction, _deleteDoc } = useDocument("wishes");

const wishlistStore = useWishlistStore()

const deleteStatus = ref("")

const currentEditedWishDoc = ref(null)

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