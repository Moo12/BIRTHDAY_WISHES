<template>
    <div class="my-20 w-full border-red-400 border-[1px] rounded-lg p-6 flex justify-center">
      <form @submit.prevent="handleSubmit" class="w-full">
        <fieldset :disabled="isPending" class="w-full flex flex-col gap-8 justify-center">
          <div class="w-full">
            <p class="text-right">שם:</p>
            <input v-model="name" type="text" placeholder="שמך" class="w-full border p-2 rounded" />
          </div>
          <div class="w-full">
            <p class="text-right">הברכה שלי:</p>
            <textarea v-model="content" placeholder="איחוליך..." class="w-full border p-2 rounded"></textarea>
          </div>
  
          <WishImages
            ref="wishImagesRef"
            :initialImages="images"
            :uploadBaseUrl="UPLOAD_BASE_URL"
            @update:images="handleImagesUpdate"
          />
  
          <div class="w-full flex items-center gap-2">
            <input type="checkbox" v-model="publicWish" id="public" />
            <label for="public" class="text-right" dir="rtl">פומבי () </label>
          </div>
  
          <div class="flex justify-between w-full">
            <button class="btn rounded-md border-2 px-4 border-black" @click="emit('save', 'cancel')">ביטול</button>
            <button class="btn rounded-md border-2 px-4 border-black" type="submit">{{ submitText }}</button>
          </div>
        </fieldset>
      </form>
  
      <div v-if="isPending">Uploading Wish</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import WishImages from "@/components/WishImages.vue";
  import useCollection from "@/composables/useCollection";
  import useAuth from "@/composables/useAuth";
  
  const props = defineProps({
    wishDoc: { type: Object, default: null },
  });
  const emit = defineEmits(["save"]);
  
  const { user } = useAuth();
  const { error: errAddToDb, pending: pendingDb, addDocImp } = useCollection("wishes");
  
  const UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;
  
  const wishImagesRef = ref(null);
  
  const images = ref([]); // array of image URLs managed by WishImages
  const name = ref("");
  const content = ref("");
  const publicWish = ref(false);
  
  const state = ref("");
  const submitText = ref("שלח.י");
  
  // Initialize form fields including images
  onMounted(() => {
    if (props.wishDoc) {
      name.value = props.wishDoc.name || "";
      content.value = props.wishDoc.content || "";
      publicWish.value = props.wishDoc.public || false;
      images.value = props.wishDoc.images_url || [];
  
      submitText.value = " עדכנ.י ברכה";
    }
  });
  
  // Receive updated images from WishImages
  function handleImagesUpdate(updatedImages) {
    images.value = updatedImages;
  }
  
  const handleSubmit = async () => {
    state.value = "upload";
  
    // Ask WishImages to save images (delete + upload)
    if (wishImagesRef.value) {
      await wishImagesRef.value.saveImages();
    }
  
    // Now images.value should be updated
    const wishPayload = {
      name: name.value,
      content: content.value,
      images_url: [...images.value],
      user: user?.value.uid || "anonymous",
      public: publicWish.value,
    };
  
    const id = props.wishDoc?.id || null;
    await addDocImp(wishPayload, id);
  
    state.value = "end";
  };
  
  const isPending = computed(() => state.value === "upload");
  
  // Watch to emit save status back to parent (if needed)
  watch(() => state.value, (val) => {
    if (val === "end") {
      if (!pendingDb.value && !errAddToDb.value) {
        if (!props.wishDoc) {
          name.value = "";
          content.value = "";
          images.value = [];
          publicWish.value = false;
        }
        emit("save", "success");
      } else {
        emit("save", "error");
      }
      state.value = "";
    }
  });
  </script>
  