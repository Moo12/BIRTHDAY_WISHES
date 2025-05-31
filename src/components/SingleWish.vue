<template>
    <div class="border-2 px-8 py-4 rounded-md shadow-md min-w-full max-w-full">
        <div class="flex flex-col gap-10 items-start w-full" >
            <div class="flex flex-col items-start w-full">
                <div v-if="editable" class="flex justify-between w-full">
                    <h3 class="text-lg font-bold text-purple-500">{{ wish.name }}</h3>
                    <div class="flex gap-2">
                        <button class="btn" @click="$emit('edit', wish.id)">
                            <Pencil class="h-5 w-5 text-blue-600"/>
                        </button>
                        <button class="btn" @click="$emit('remove', wish.id)">
                            <Trash2 class="h-5 w-5 text-red-400"/>
                        </button>
                    </div>
                </div>
                <div v-else>
                    <h3 class="text-lg font-bold text-purple-500">{{ wish.name }}</h3>
                </div>
                <p class="text-sm text-gray-500">{{ formatDate(wish.metadata.created_at) }}</p>
            </div>
            <p class="text-gray-700 text-right">{{ wish.content }}</p>
            <p class="text-sm text-gray-500">פומבי: {{ wish.public ? "כן" : "לא" }}</p>
            <button v-if="wish?.images_url?.length" @click="expanded = !expanded" class="text-xl">
                <span v-if="expanded">&#x25B2;</span> <!-- Up arrow -->
                <span v-else>&#x25BC;</span>           <!-- Down arrow -->
            </button>
            <div v-if="expanded" class="mt-4">
                <div class="flex gap-2 flex-wrap mt-2">
                    <img
                        v-for="(img, i) in wish.images_url"
                        :key="i"
                        :src="`${UPLOAD_BASE_URL}${img}`"
                        class="w-32 h-32 object-cover rounded border"
                    />
                </div>
            </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { Pencil, Trash2 } from 'lucide-vue-next'
  
  const props = defineProps({
    wish: Object,
    editable: Boolean
  })

  const UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;

  const emit = defineEmits(["edit", "remove"]);
  
  const expanded = ref(false)
  
  const formatDate = (ts) => {
    if (!ts || !ts.toDate) return "N/A"
    const date = ts.toDate()
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }
  </script>
  