<template>
    <div class="flex flex-col items-center justify-center">
        <WishImages v-if="mountedCallbackEnd"
        ref="wishImagesRef"
        :initialImages="images"
        :isWishImages = "false"
        :uploadBaseUrl="UPLOAD_BASE_URL"
        @update:images="handleImagesUpdate" >
            <template #extra-inputs="slotProps">
                <div class="text-xs space-y-1">
                    <label>
                        role:
                        <select v-model="imageRoles[slotProps.url]" class="border rounded p-1 text-sm">
                            <option v-for="option in roleOptions" :key="option" :value="option">
                                {{ option }}
                            </option>
                        </select>
                    </label>
                    <div class="mt-1">
                        <input 
                            type="text" 
                            v-model="customRoles[slotProps.url]" 
                            @input="handleCustomRole(slotProps.url)"
                            placeholder="new role ..."
                            class="border rounded p-1 text-sm w-full"
                        />
                    </div>
                </div>
            </template>
        </WishImages>
        <div>
            <button @click="handleSubmit" class="btn" :disable="actionState.state === 'process'" >Upload Images</button>
        </div>
        <div v-if="actionState.state === 'end'">
            {{ uploadEndStr }}
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

const imageRoles = ref({});

const roleOptions = ["main", "sub"];

const images = ref([])

const mountedCallbackEnd = ref(false)

const actionState = ref ({
    status: "success",
    state: ""
})

const customRoles = ref({})

onMounted(() => {
    console.log("images:", props.document)

    images.value = props.document?.images_url.map(item => item?.url || item) || [];

    // Set default roles for existing images (all "sub" by default)
    props.document?.images_url.forEach(item => {
        imageRoles.value[item?.url || item] = item?.role || "none";
        if (!roleOptions.includes(item?.role || "none")) {
            roleOptions.push(item?.role || "none");
        }
    });

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

    console.log(imagesStatus.images)

    // Map image URLs with their roles
    const imagesWithRoles = imagesStatus.images.map(url => ({
        url,
        role: imageRoles.value[url] || "none"
    }));

    console.log("imagesWithRoles", imagesWithRoles)
    
    let response = {
        status: actionState.value.status,
        data: {
             images: imagesWithRoles
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

const handleCustomRole = (url) => {
    if (customRoles.value[url]?.trim()) {
        imageRoles.value[url] = customRoles.value[url].trim()
    }
}

</script>