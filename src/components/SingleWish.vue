<template>
    <div class=" px-8 py-4 rounded-md md:min-h-[30vh]  min-w-full max-w-full" @click="handleWishClick">
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
                    <p class="text-[20px] md:text-[24px] font-bold text-black">{{ wish.name }}</p>
                </div>
                <div v-if="is_date">
                    <p class="text-sm text-gray-500">{{ formatDate(wish.metadata.created_at) }}</p>
                </div>
            </div>
            
            <p class="text-gray-700 text-right text-[18px] md:text-[20px] leading-relaxed whitespace-pre-line">{{ wish.content }}</p>
            <div v-if="is_public">
                <p class="text-sm text-gray-500">פומבי: {{ wish.public ? "כן" : "לא" }}</p>
            </div>
            <div class="flex flex-col gap-2">
                <div v-if="wish?.images_url?.length" class="">
                    <div class="flex gap-2 flex-wrap" >
                        <MediaDisplay
                            v-for="(img, i) in wish.images_url"
                            :key="i"
                            :src="img"
                            :controls="false"
                            @click="currentImageIndex = i; imagesModalOpen = true;"
                            class="max-w-32 h-auto rounded border btn"
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
  import MediaDisplay from './MediaDisplay.vue'

  const props = defineProps({
    wish: Object,
    editable: Boolean,
    border: { type: Boolean, default: true },
    is_date: { type: Boolean, default: true },
    is_public: { type: Boolean, default: true }
  })
  
  const images = ref([])
  const imagesModalOpen = ref(false)
  const currentImageIndex = ref(0) 

  const emit = defineEmits(["edit", "remove", "open"]);
  
  const handleWishClick = () => {
    console.log("handleWishClick SingleWish")
    emit('open', props.wish.id)
  }

  const formatDate = (ts) => {
    if (!ts || !ts.toDate) return "N/A"
    const date = ts.toDate()
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  onMounted(() => {
    images.value = props.wish?.images_url?.map( (item, index) => {
        return { image: item, index: index }
    })
  });
  </script>
  