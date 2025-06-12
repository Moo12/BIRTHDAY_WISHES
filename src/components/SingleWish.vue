<template>
    <div class="border-2 px-8 py-4 rounded-md md:min-h-[30vh] shadow-md min-w-full max-w-full">
        <div class="flex flex-col gap-10 items-start w-full" >
            <div class="flex flex-col items-start w-full">
                <div v-if="editable" class="flex justify-between w-full">
                    <h3 class="text-lg font-bold text-purple-500">{{ wish.name }}</h3>
                    <div class="flex gap-2">
                        <button class="btn" @click="$emit('edit')">
                            <Pencil class="h-5 w-5 text-blue-600"/>
                        </button>
                        <button class="btn" @click="$emit('remove')">
                            <Trash2 class="h-5 w-5 text-red-400"/>
                        </button>
                    </div>
                </div>
                <div v-else>
                    <p class="text-lg font-bold text-purple-500">{{ wish.name }}</p>
                </div>
                <p class="text-sm text-gray-500">{{ formatDate(wish.metadata.created_at) }}</p>
            </div>
            <p class="text-gray-700 text-right">{{ wish.content }}</p>
            <p class="text-sm text-gray-500">פומבי: {{ wish.public ? "כן" : "לא" }}</p>
            <div class="flex flex-col gap-2">
                <div v-if="wish?.images_url?.length" class="">
                    <div class="flex gap-2 flex-wrap" >
                        <img
                            v-for="(img, i) in wish.images_url"
                            :key="i"
                            :src="`${UPLOAD_BASE_URL}${img}`"
                            @click="currentImageIndex = i; imagesModalOpen = true; "
                            class="w-32 h-32 object-cover rounded border btn"
                        />
                    </div>
                </div>
            </div>
      </div>
    </div>
    <div v-if="imagesModalOpen">
        <ModalmageScroller :images="images" :index="currentImageIndex" @close="imagesModalOpen=false"/>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Pencil, Trash2 } from 'lucide-vue-next'
  import ModalmageScroller from './ModalmageScroller.vue';
  
  const props = defineProps({
    wish: Object,
    editable: Boolean
  })

  const UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;
  
  const images = ref([])
  const imagesModalOpen = ref(false)
  const currentImageIndex = ref(0) 

  const emit = defineEmits(["edit", "remove"]);
  
  const formatDate = (ts) => {
    if (!ts || !ts.toDate) return "N/A"
    const date = ts.toDate()
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  onMounted(() => {
    images.value = props.wish?.images_url?.map( (item, index) => {
        return { image: item, index: index }
    })

    console.log("images to scroller", images.value)
  });
  </script>
  