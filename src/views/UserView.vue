<template>
    <div class="my-4 md:my-6">
        <div v-if="isLoading">
            <SpinnerWrapper />
        </div>
        <div v-else>
            <div class="flex flex-col items-center justify-center gap-4 z-[9]">
                <div class="relative inline-block">

                    <button class="add-wish-btn "
                    @click="isCreateWish = true"
                    :disabled="userNumberOfWishes === configStore.maxWishesPerUser"
                    @mouseenter="isHoveredAndDisabled = userNumberOfWishes === configStore.maxWishesPerUser"
                    @mouseleave="isHoveredAndDisabled = false"
                    >
                        הוסף.הוסיפי ברכה ✨ 
                    </button>

    
                    <div
                    v-if="isHoveredAndDisabled"
                    class="absolute top-full left-1/2 -translate-x-1/2 mt-2
                            bg-white p-2 text-sm text-gray-700
                            rounded shadow-md border border-gray-300 whitespace-nowrap"
                    >
                    הגעת למספר הברכות המקסימלי
                    </div>
                </div>
        
                <div>
                    {{ createStatus }}
                </div>

                <ModalWrapper v-if="isCreateWish"
                :component="WishForm" @close="isCreateWish = false"

                />
        
                <WishesWall class="w-full"/>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useConfigStore } from '@/stores/configStore'
import { useWishlistStore } from '@/stores/wishListStore'

import useAuth from '@/composables/useAuth'

import WishesList from '@/components/WishesList.vue'
import WishesWall from '@/components/WishesWall.vue'
import WishForm from '@/components/WishForm'
import BicyclePedals from '@/components/BicyclePedals'
import ModalWrapper from '@/components/ModalWrapper'
import SpinnerWrapper from '@/components/SpinnerWrapper.vue'

const isHoveredAndDisabled = ref(false);

const { user } = useAuth()

const isCreateWish = ref(false)
const createStatus = ref("")

const configStore = useConfigStore()
const wishlistStore = useWishlistStore()

const userNumberOfWishes = computed(() =>{
    const userWishes = wishlistStore.documents?.filter(item => item.user === user.value?.uid)

    console.log("userWishes?.length", userWishes?.length)

    return userWishes?.length || 0
})


const handleImageSave = (status) => {
    console.log("handleImageSave", status)

    
    if (status === "success"){
        createStatus.value = "האיחול נוסף בהצלחה"
        isCreateWish.value = false
    }
    else if (status === "cancel"){
        createStatus.value = ""
        isCreateWish.value = false
    }

    else if (status === "failure"){
        createStatus.value = "שגיאה נקרתה בזמן הוספת הברכה"
    }

    setTimeout(() => {
        createStatus.value = "";
  }, 3000);
}

const isLoading = computed(() => {
    if ( configStore && wishlistStore){
        return configStore.loading || wishlistStore.loading
    }
    
    return true
})



</script>

<style scoped>
@keyframes soft-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

  .add-wish-btn {
  background-color: #fadadd;
  color: #702963;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s ease-in-out;
  animation: soft-pulse 1.5s infinite;
  border: none;
}
.add-wish-btn:hover {
  animation: none; /* ❗ cancel the animation */
  transform: scale(1.1); /* hover zoom */
  opacity: 0.7;
  background-color: #702963;
  color: #fadadd;


}

</style>
