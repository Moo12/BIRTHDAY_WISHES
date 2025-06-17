<template>
    <div class="flex flex-col gap-4">
        <!-- Existing images -->
        <div v-if="isWishImages" class="self-start">
            <label>תמונות </label>
            <label>{{ configStore.maxImagesPerWish }}  / {{ numberOfUsedImages }}</label>
        </div>
        <div class="grid md:grid-cols-6 sm:grid-cols-4 grid-cols-2 gap-3 rounded overflow-hidden" >
            <div v-for="(img, index) in currentImages" :key="index" class="w-full">
                <div class="flex flex-col w-full justify-between items-center h-full gap-2">
                    <div class="relative">
                        <MediaDisplay 
                            :src="img"
                            class="w-full h-auto rounded border"
                        />
                        <button
                            type="button"
                            class="absolute top-0 right-0 bg-transparent font-black rounded-bl px-1 text-black"
                            @click="removeImage(img)"
                        >
                            ✕
                        </button>
                    </div>
                    <slot name="extra-inputs" :url="img" :index="index"></slot>
                </div>
            </div>
        </div>
        <div>
            <!-- Hidden file input -->
            <input
                type="file"
                id="fileInput"
                ref="fileInput"
                @change="handleFilesSelected"
                class="hidden"
                multiple
                accept="image/*,video/*"
            />

            <!-- Custom label styled as button with icon -->
            <label
                for="fileInput"
                class="btn inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v8m0 0l-4-4m4 4l4-4m0-5a4 4 0 10-8 0"
                    />
                </svg>
                העלאת תמונות ווידאו
            </label>
        </div>
        <!-- Selected files preview with status and preview -->
        <div v-if="selectedFiles.length" class="flex flex-col gap-1 mt-2 text-sm">
            <div
                v-for="file in selectedFiles"
                :key="file.name"
                class="flex items-center gap-4"
            >
                <!-- Image Preview -->
                <img
                    v-if="file.type && file.type.startsWith('image/')"
                    :src="filePreview(file)"
                    alt="preview"
                    class="w-16 h-16 object-cover rounded border"
                />
                <!-- Video Preview -->
                <video
                    v-else-if="file.type && file.type.startsWith('video/')"
                    :src="filePreview(file)"
                    class="w-16 h-16 object-cover rounded border"
                    muted
                >video</video>
                <span v-else>{{ file.name }}</span>
                <span>
                    <span v-if="uploadStatuses[file.name] === 'uploading'" class="text-blue-500">Uploading...</span>
                    <span v-else-if="uploadStatuses[file.name] === 'done'" class="text-green-600">Uploaded..</span>
                    <span v-else-if="uploadStatuses[file.name] === 'failed'" class="text-red-600">Failed</span>
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref, reactive, computed, defineExpose } from "vue";
    import useImage from "@/composables/useImages";
    import { useConfigStore } from '@/stores/configStore'
    import MediaDisplay from './MediaDisplay.vue'

    const ERROR_MESSAGES = {
        1001: "ההתחברות נכשלה. אנא נסה/י להתחבר מחדש.",
        1002: "חסרה הרשאת התחברות. אנא התחבר/י שוב.",
        1003: "רק מנהלים יכולים להעלות תמונות לאתר.",
        1004: "המשתמש לא נמצא.",
        1005: "הקובץ אינו תמונה או וידאו חוקי.",
        1006: "גודל הקובץ חורג מהמותר.",
        1007: "הגעת למספר המירבי של קבצים.",
        1008: "הקובץ לא נמצא.",
        1009: "מחיקת הקובץ נכשלה.",
        1010: "קובץ וידאו חורג מהמותר.",
        1011: "שגיאה לא מוכרת."
    };

    const configStore = useConfigStore()

    const props = defineProps({
    isWishImages : { type: Boolean, default: true },
    initialImages: { type: Array, default: () => [] },
    uploadBaseUrl: { type: String, required: true },
    });

    const emit = defineEmits(["update:images"]);

    const fileInput = ref(null);

    const currentImages = ref([...props.initialImages]); // URLs currently shown (after deletes/uploads)
    const deletedImages = ref([]); // URLs removed, to delete from backend
    const selectedFiles = ref([]);
    const uploadStatuses = reactive({});


    const { pending, UploadImage, UploadGeneralImage, deleteImage, deleteGeneralImage} = useImage()

    const isImageFile = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension);
    };

    const isVideoFile = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        return ['mp4', 'webm', 'ogg'].includes(extension);
    };

    const filePreview = (file) => {
        if (!file) return '';
        return URL.createObjectURL(file);
    };

    const handleFilesSelected = () => {
        const files = fileInput.value?.files;
        if (!files) return;

        
        // Validate file types and sizes
        const validFiles = Array.from(files).filter(file => {
            const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
            console.log("isValid type", isValidType)
            
            return isValidType;
        });
        console.log("valid Files", validFiles)

        selectedFiles.value = validFiles;
        selectedFiles.value.forEach((file) => {
            uploadStatuses[file.name] = "pending";
        });
    };

    const removeImage = (imgUrl) => {
    // Remove from current images
    currentImages.value = currentImages.value.filter((img) => img !== imgUrl);

    // If it's an existing image (came from initialImages), mark for backend deletion
    if (props.initialImages.includes(imgUrl)) {
        deletedImages.value.push(imgUrl);
    }
    };

    function clearImages() {
        if (fileInput.value) fileInput.value.value = "";
    }

    async function saveImages(wishId) {
        saveImagesImp(wishId)
    }

    async function saveGeneralImages() {
        saveImagesImp()
    }

    async function saveImagesImp(wishId = null) {

    const statusReport = {};

    // 1. Delete removed images from backend
    for (const url of deletedImages.value) {
        const fileName = url.split("/").pop();
        let fileStatus;
        let deletedStatus
        if (fileName) {
        try {
            if (props.isWishImages){
                deletedStatus = await deleteImage(fileName, wishId);
            }
            else{
                deletedStatus = await deleteGeneralImage(fileName);

            }

            if (deletedStatus?.success){
                console.log('deletedImage', fileName)
                fileStatus = "done";
            }
            else{
                console.error('failed to delete', fileName)
                fileStatus = "failed";
            }
        } catch (err) {
            console.error("Failed to delete image:", fileName, err);
            fileStatus = "failed";
        }
        let error_code = deletedStatus?.error_code

        let errMsg = ""
        if (fileStatus === "failed"){
            errMsg = ERROR_MESSAGES[error_code] || "שגיאה לא מוכרת"
        }

        statusReport[fileName] = { status: fileStatus, msg: errMsg}
        }
    }

    deletedImages.value = [];

    // 2. Upload selected files one by one
    for (const file of selectedFiles.value) {
        uploadStatuses[file.name] = "uploading";
        let fileStatus;
        let response
        try {
            if (props.isWishImages){
                response = await UploadImage(file, wishId);
            }
            else{
                response = await UploadGeneralImage(file);
            }
            if (response?.success) {
                currentImages.value.push(response.url);
                console.log("uploadedUrl", response.url)
                uploadStatuses[file.name] = "done";
                fileStatus = "done";
            } else {
                uploadStatuses[file.name] = "failed";
                fileStatus = "failed";
                console.error ("uploaded failed: ", file)
            }
        } catch {
            fileStatus = "failed";
            uploadStatuses[file.name] = "failed";
        }

        let error_code = response?.error_code || 1010

        console.log("error_code", error_code)

        let errMsg = ""
        if (fileStatus === "failed"){
            errMsg = ERROR_MESSAGES[error_code] || ERROR_MESSAGES[1010]

            console.log("errMsg", errMsg)
        }

        statusReport[file.name] = { status: fileStatus, msg: errMsg}
    }

    const hasImageErrors = Object.values(statusReport || {}).some(status => status.status !== "done");

    if (!hasImageErrors){

        selectedFiles.value = [];
    }

    console.log("hasImageErrors", typeof(hasImageErrors), statusReport)

    // Clear selected files & input
    if (fileInput.value) fileInput.value.value = "";

    // 3. Emit updated list and upload/delete statuses
    emit("update:images", {
        images: [...currentImages.value],
        statuses: { ...statusReport }
    });
    }

    const numberOfUsedImages = computed(() => {
        return (currentImages.value?.length || 0)
    });

    // expose saveImages method to parent
    defineExpose({ saveImages, currentImages, clearImages, saveGeneralImages });
</script>