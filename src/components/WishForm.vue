<template>
    <div class="relative my-20 w-full p-6 flex flex-col justify-center bg-white">
        <div v-if="isSubmitEnded">
            <p
            :class="{
                'text-green-600': actionState.status === 'success',
                'text-red-600': actionState.status === 'failure',
            }"
            class="text-center mt-4 font-semibold"
            >
            {{ uploadEndStr }}
            </p>
        </div>
        <form @submit.prevent="handleSubmit" class="w-full" :disabled="isPending">
            <fieldset :disabled="isPending" class="w-full flex flex-col gap-8 justify-center">
                <div class=" w-full">
                    <p class="text-right">שם:</p>
                    <input v-model="name" type="text" placeholder="שמך" class="w-full border p-2 rounded" />
                </div>
                <div class=" w-full" >
                    <p class="text-right">הברכה שלי:</p>
                    <textarea v-model="content" placeholder="איחוליך..." class="w-full border p-2 rounded" rows="10"></textarea>
                </div>
                <div v-if="errorMessage" class="text-red-600 text-center font-semibold">{{ errorMessage }}</div>

                <div v-if=afterMounted>
                    <WishImages
                        ref="wishImagesRef"
                        :initialImages="images"
                        :uploadBaseUrl="UPLOAD_BASE_URL"
                        @update:images="handleImagesUpdate"
                    />
                </div>
                <div class="w-full flex items-center gap-2">
                    <label for="public" class="text-right" dir="rtl">
                    פומבי ({{ publicWish ? 'כן' : 'לא' }})
                    </label>
                    <input type="checkbox" v-model="publicWish" id="public" />
                </div>
                <div class="flex justify-between w-full">
                    <button class="btn rounded-md border-2 px-4 border-black" type="button" @click="emit('cancel')">ביטול</button>
                    <button class="btn rounded-md border-2 px-4 border-black" type="submit">{{submitText}}</button>
                </div>
            </fieldset>
        </form>
        <div v-if="isPending">
            <div class="fixed inset-0 bg-black/70 flex items-center justify-center">
                <div class="w-[5%]">
                    <WheelSpinner />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';

import useCollection from '@/composables/useCollection'
import useAuth from "@/composables/useAuth"
import WishImages from "@/components/WishImages.vue";
import WheelSpinner from "@/components/WheelSpinner.vue"
import { useGeneralCollectionStore } from '@/stores/generalDocsStore'



const emit = defineEmits(["save", "cancel"]);
const props = defineProps({
    wishDoc: { type: Object, default: null }  // Editable wish (or null)
});

const { user } = useAuth()
const { error : errAddToDb, pending : pendingDb, addDocImp } = useCollection()

const generalDocsStore = useGeneralCollectionStore()

const loadingDocName = "loading"
const UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;

const images = ref([]);  // All image URLs
const name = ref("")
const content = ref("")
const publicWish = ref(true);  // ✅ New boolean field

const wishImagesRef = ref(null);

const afterMounted = ref(false)

const actionState = ref({state: "", status: "" })
const submitText = ref("שלח.י")

const uploadEndStr = ref("")

const editMode = ref(false)

const currentWishId = ref(null)

const errorMessage = ref("")

// Populate form if editing
onMounted(() => {
    afterMounted.value = false
    if (props.wishDoc) {
        name.value = props.wishDoc.name || "";
        content.value = props.wishDoc.content || "";
        publicWish.value = props.wishDoc.public || false;
        images.value = props.wishDoc.images_url || [];

        console.log("images", images.value)

        submitText.value = " עדכנ.י ברכה"

        currentWishId.value = props.wishDoc.id

        editMode.value = true
    }

    afterMounted.value = true
});

// Add a watcher to clear errorMessage when content is entered
watch(() => content.value, (val) => {
  if (val && val.trim() !== "") {
    errorMessage.value = ""
  }
})

  // Receive updated images from WishImages
async function handleImagesUpdate(imagesStatus) {

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

    const wish = {
        name: name.value || user.value.displayName,
        content: content.value,
        images_url: [...images.value],
        user: user?.value.uid || "anonymous",
        public: publicWish.value,
    }

    const docUpload = await addDocImp("wishes", wish, currentWishId.value)
    if (docUpload === null) {
        console.error("Failed to upload wish to DB");
        uploadEndStr.value += " שגיאת מסד נתונים.";
        actionState.value.status = "failure";
    }

    actionState.value.state = "end"

    if (actionState.value.status === "success") {
    uploadEndStr.value = editMode.value ? "עודכן בהצלחה 🎉" : "נשלח בהצלחה 🎉";
        setTimeout(() => {
            resetForm()
            emit("save", "success");
            actionState.value.state = "";
            actionState.value.status = "";

        }, 3000);
    } 
    else {
        emit("save", "error");
    }
}

const handleSubmit = async (e) => {
  errorMessage.value = ""
  if (!content.value || content.value.trim() === "") {
    errorMessage.value = "יש למלא תוכן לברכה לפני שליחה."
    return
  }

  console.log("handleSubmit")
  actionState.value.state = "upload"
  actionState.value.status = "success"
  uploadEndStr.value = "";

  let id = currentWishId.value || null;

  //create doc before uplaod images to get id
  if (!editMode.value){
    const docUpload = await addDocImp("wishes", {}, id)

    if (docUpload === null) {
        console.error("Failed to upload wish to DB");
        uploadEndStr.value += " שגיאת מסד נתונים.";
        actionState.value.status = "failure";
        actionState.value.state = "end"

        if (wishImagesRef.value) {
            wishImagesRef.value.clearImages();
        }
        emit("save", "error");

        return;
    }

    console.log("docUpload",docUpload.id)
    currentWishId.value = docUpload.id
  }

  // Ask WishImages to save images (delete + upload)
  if (wishImagesRef.value) {
    wishImagesRef.value.saveImages(currentWishId.value);
  }
}

function resetForm() {
  name.value = "";
  content.value = "";
  images.value = [];
  publicWish.value = true;
}


const isPending = computed(() => actionState.value.state === "upload");
const isSubmitEnded = computed(() => actionState.value.state === "end");


</script>