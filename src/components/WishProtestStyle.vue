<template>
    <div class="bg-album-paper p-6 shadow-lg rounded-lg max-w-2xl mx-auto relative overflow-hidden">
      <!-- Decorative page number / tab -->
      <div class="absolute top-0 left-0 bg-yellow-200 px-3 py-1 text-xs font-bold rounded-br-xl">
        ✿ עמוד משאלות ✿
      </div>
  
      <!-- Wish Header -->
      <div class="text-3xl font-handwritten text-purple-800 mb-2">
        {{ wish.name }}
      </div>
      <div class="text-sm text-gray-600 mb-4">
        {{ formatDate(wish.metadata.created_at) }}
      </div>
  
      <!-- Wish Content -->
      <div class="bg-white bg-opacity-80 p-4 rounded border border-dashed border-gray-300 text-lg font-handwritten text-gray-800 whitespace-pre-wrap leading-relaxed">
        {{ wish.content }}
      </div>
  
      <!-- Images Section -->
      <div v-if="wish.images_url?.length" class="mt-4 flex flex-wrap gap-4 justify-center">
        <div
          v-for="(img, index) in wish.images_url"
          :key="index"
          class="relative w-32 h-32 bg-white border border-gray-300 rounded-lg shadow-sm"
        >
          <img
            :src="`${UPLOAD_BASE_URL}${img}`"
            class="w-full h-full object-cover rounded-lg"
          />
          <!-- "Tape" corners -->
          <div class="absolute w-4 h-4 bg-yellow-300 rotate-45 top-[-8px] left-[-8px]"></div>
          <div class="absolute w-4 h-4 bg-yellow-300 rotate-45 top-[-8px] right-[-8px]"></div>
          <div class="absolute w-4 h-4 bg-yellow-300 rotate-45 bottom-[-8px] left-[-8px]"></div>
          <div class="absolute w-4 h-4 bg-yellow-300 rotate-45 bottom-[-8px] right-[-8px]"></div>
        </div>
      </div>
  
      <!-- Decorative Israeli Cake Flag -->
      <img
        src="/assets/album_page.png"
        alt="Israeli cake flag"
        class="absolute bottom-2 right-2 w-12 h-auto opacity-80"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    wish: Object
  });
  
  const UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;
  
  const formatDate = (ts) => {
    if (!ts || !ts.toDate) return "N/A"
    const date = ts.toDate()
    return date.toLocaleDateString('he-IL') + ' ' + date.toLocaleTimeString('he-IL')
  };
  </script>
  
  <style scoped>
  .bg-album-paper {
    background-image: url('@/assets/album_page.png'); /* Add a soft paper texture image to your assets */
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border: 1px solid #ddd;
  }
  
  /* Optional handwritten Hebrew font */
  @import url('https://fonts.googleapis.com/css2?family=David+Libre&display=swap');
  
  .font-handwritten {
    font-family: 'David Libre', sans-serif;
  }
  </style>
  