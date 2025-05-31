<template>
    <div class="flex flex-col items-center justify-center gap-4 z-[9]">

        <p class="text-right">האיחולים שלך ושאר ברכות פומביות</p>

        <div>
            <button @click="isCreateWish = true;">הוסף.הוסיפי ברכה</button>
        </div>

        <div>
            {{ createStatus }}
        </div>    

        <div v-if="isCreateWish" class="fixed inset-0 bg-black z-[10] w-full bg-opacity-80 h-[100vh]" dir="rtl">
            <div class="w-[50%] mx-auto">
                <WishForm @save="handleImageSave"/>
            </div>    
        </div>    

        <WishesList class="w-full"/>
    </div>
</template>

<script setup>
import { ref } from "vue"
import WishesList from '@/components/WishesList.vue'
import WishForm from '@/components/WishForm'

const isCreateWish = ref(false)
const createStatus = ref("")

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
