<template>
    <div class="my-4 md:my-6">
        <div v-if="configStore.loading">
            Loading...
        </div>
        <div v-else>
            <div class="flex flex-col items-center justify-center gap-4 z-[9]">
        
                <p class="text-right">האיחולים שלך ושאר ברכות פומביות</p>
        
                <div class="relative inline-block">
                    <button
                    class="btn"
                    @click="isCreateWish = true"
                    :disabled="userNumberOfWishes === configStore.maxWishesPerUser"
                    @mouseenter="isHoveredAndDisabled = userNumberOfWishes === configStore.maxWishesPerUser"
                    @mouseleave="isHoveredAndDisabled = false"
                    >
                    הוסף.הוסיפי ברכה
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
        
                <div v-if="isCreateWish" class="fixed inset-0 bg-black z-[10] w-full bg-opacity-80 h-[100vh]" dir="rtl">
                    <div class="md:w-[50%] w-[90%] mx-auto">
                        <WishForm @save="handleImageSave"/>
                    </div>    
                </div>    
        
                <WishesList class="w-full"/>
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
import WishForm from '@/components/WishForm'

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

</script>
