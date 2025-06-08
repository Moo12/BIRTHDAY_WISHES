<template>
    <div class="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
      <div v-if="generalDocsStore.loading" class="flex items-center justify-center">
        <div>
        </div>
      </div>
      <div v-else class="flex items-center justify-center w-[60%] md:w-[30%]">
        <img  class="w-full h-full object-cover" :src="`${VUE_APP_UPLOAD_BASE_URL}${generalDocsStore.document(loadingDocName)?.images_url[0]}`" />
      </div>
      <WheelSpinner />
    </div>
  </template>
  
<script setup>
  import { useGeneralCollectionStore } from '@/stores/generalDocsStore'
  import WheelSpinner from './WheelSpinner.vue'

  const loadingDocName = "loading"

  const VUE_APP_UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL

  const generalDocsStore = useGeneralCollectionStore()

  
</script>