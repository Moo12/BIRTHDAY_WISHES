<template>
    <div
      class="fixed inset-0 bg-gray-100 z-[99]  h-[100vh] w-[100vw] flex items-center justify-center"
      @wheel="onScroll"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="z-[1000] absolute top-4 left-4  text-black rounded-full w-10 h-10 flex items-center justify-center transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
  
      <div class="w-full max-w-screen-xl grid  md:grid-cols-12 grid-cols-6 gap-2 items-center mx-[30px] md:mx-[45px]">
        <!-- Right Arrow -->
        <div class="flex justify-center items-center ">
          <button
          @click="nextImage"
          class="bg-white rounded-full  w-12 h-12 flex items-center justify-center text-black-light btn transition"
          >
          <ArrowRight/>
        </button>
      </div>
      
      <!-- Image -->
      <div class="md:col-span-10 flex justify-center items-center overflow-hidden">
        <img
        :src="`${UPLOAD_BASE_URL}${images[currentIndex].image}`"
        alt="Image"
        class="block h-auto w-full md:w-auto object-cover transition duration-300"
        />
      </div>
      
        <!-- Left Arrow -->
        <div class="flex justify-center items-center">
          <button
            @click="prevImage"
            class="bg-white rounded-full w-12 h-12 flex items-center justify-center text-black-light btn transition"
          >
          <ArrowLeft/>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ArrowRight, ArrowLeft } from "lucide-vue-next";
  
  const props = defineProps({
    images: {
      type: Array,
      required: true
    },
    index: {
        type: Number,
        required: false
    }
  })

  const UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;
  
  const emit = defineEmits(['close'])
  
  const currentIndex = ref(props.index || 0)
  
  const nextImage = () => {
    currentIndex.value = (currentIndex.value + 1) % props.images.length
  }
  
  const prevImage = () => {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
  }
  
  // Mouse scroll
  const onScroll = (event) => {
    if (event.deltaY > 0) {
      nextImage()
    } else {
      prevImage()
    }
  }
  
  // Touch swipe
  let touchStartX = 0
  
  const onTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX
  }
  
  const onTouchEnd = (e) => {
    const endX = e.changedTouches[0].screenX
    if (endX < touchStartX - 50) nextImage()
    if (endX > touchStartX + 50) prevImage()
  }
  </script>
  