<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black/70 z-[150] w-full h-[100vh]  overflow-y-auto flex items-center" dir="rtl">
      <div
        class="flex relative flex-col md:w-[60%] w-[90%] mx-auto rounded-xl shadow-md "
        :class="{
          'border-2' : !backgroundImageUrl
        }"
        :style="backgroundImageUrl ? { aspectRatio: `${1 / imageAspectRatio}` } : { height: '80%' }">

        <img 
          v-if="backgroundImageUrl"
          :src="backgroundImageUrl" 
          alt="Modal Background" 
          class="absolute inset-0 w-full h-full z-[1] object-cover rounded-xl"
        />
        <div class="relative z-[2] flex flex-col w-full h-full overflow-y-auto"
        :class="{'bg-gray-100' : !backgroundImageUrl}">
          <button
            class="sticky top-[7%] mt-[5%] ml-2 z-[2] self-end font-semibold text-gray-600 hover:bg-gray-300 p-2 rounded-lg text-xl"
            :class="[{'mt-[6%] ml-[2%]' : backgroundImageUrl }, {'mt-2' : !backgroundImageUrl}]"
            @click="$emit('close')"
          >
            ✕
          </button>
            <div class="flex flex-col items-center justify-center ">
              <component
                :is="component"
                v-bind="componentProps"
                @edit="$emit('edit', $event)"
                @remove="$emit('remove', $event)"
                @cancel="$emit('close')"
                @save="$emit('save', $event); console.log('save modal wrraper')"
              />
            </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  component: Object,       // the component to render dynamically
  componentProps: Object,  // props to pass to the dynamic component
  backgroundImageUrl: {    // New prop for background image URL
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'edit', 'save', 'remove'])

const imageAspectRatio = ref(0); 

// Computed property to generate the padding-bottom style
const calculatedPaddingBottom = computed(() => {
  // If aspect ratio is known and positive, return it as a percentage
  // Otherwise, fallback to 'auto' or a default height for safety
  return imageAspectRatio.value > 0 ? `${imageAspectRatio.value * 100}%` : '56.25%'; // Default to 16:9 aspect ratio if no image or error
});

// Watch for changes in the backgroundImageUrl prop
watch(() => props.backgroundImageUrl, (newUrl) => {
  if (newUrl) {
    const img = new Image(); // Create a new Image object
    img.src = newUrl; // Set its source to the background URL

    // When the image loads, calculate its aspect ratio
    img.onload = () => {
      imageAspectRatio.value = img.height / img.width;
      console.log(`Image loaded. Width: ${img.width}, Height: ${img.height}, Aspect Ratio: ${imageAspectRatio.value}`);
    };

    // Handle potential errors during image loading
    img.onerror = () => {
      console.error("Failed to load background image for aspect ratio calculation:", newUrl);
      imageAspectRatio.value = 0; // Reset on error
    };
  } else {
    imageAspectRatio.value = 0; // Reset when backgroundImageUrl is null/empty
  }
}, { immediate: true }); // Run immediately on component mount with initial prop value
</script>

<style scoped>
</style>
