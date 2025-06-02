<template>
    
    <div class="flex flex-col items-center justify-center">
        <WishImages v-if="mountedCallbackEnd"
        ref="wishImagesRef"
        :initialImages="images"
        :isWishImages = "false"
        :uploadBaseUrl="UPLOAD_BASE_URL"
        @update:images="handleImagesUpdate"
        />
        <div>
            <button @click="handleSubmit" class="btn" :disable="actionState.state === 'process'" >Upload Images</button>
        </div>
        <div v-if="actionState.state === 'end'">
            {{uploadEndStr}}
        </div>
    </div>


</template>

<script setup>
import { ref, onMounted } from 'vue'
import WishImages from './WishImages'

const emit = defineEmits(["upload"]);

const props = defineProps({
    document : { type: Object}
    });

const UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;

const wishImagesRef = ref(null);

const images = ref([])

const mountedCallbackEnd = ref(false)

const actionState = ref ({
    status: "success",
    state: ""
})

onMounted(() => {
    console.log("images:", props.document)

    images.value = props.document?.images_url || [];

    mountedCallbackEnd.value = true
})

const uploadEndStr = ref("")

const handleImagesUpdate = async (imagesStatus) => {
    console.log("handleImagesUpdate", imagesStatus)
    images.value = imagesStatus.images;

    const hasImageErrors = Object.values(imagesStatus.statuses || {}).some(status => status.status !== "done");

    if (hasImageErrors) {
        const errorIns = Object.values(imagesStatus.statuses || {}).filter(status => status.status === "failed");

        console.log("errorIns", errorIns)

        if (errorIns?.length){

            uploadEndStr.value += errorIns[0].msg;
        }
        else{
            uploadEndStr.value += "שגיאה בהעלאת תמונות. ";
        }

        actionState.value.status = "failure";
    }
    else{
        actionState.value.status = "success";
        uploadEndStr.value = "עודכן בהצלחה 🎉" ;
    }

    actionState.value.state = "end"
    
    let response = {
        status: actionState.value.status,
        data: {
            images: imagesStatus.images
        }
    }

    emit("upload", response);

    actionState.value.state = "";
    actionState.value.status = "";
}

const handleSubmit = async (e) => {
    actionState.value.state = "process"

    console.log("handleSubmit")

    if (wishImagesRef.value) {
        wishImagesRef.value.saveGeneralImages();
    }
}

</script>