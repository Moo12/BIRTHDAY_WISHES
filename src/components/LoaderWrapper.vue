<template>
    <div class="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
      <div class="flex items-center justify-center w-[60%] md:w-[10%]">
        <div v-if="generalDocsStore.loading" class="w-full h-full">
          <WheelSpinner/>
        </div>
        <div v-else>
          <img  class="w-full h-full object-cover" :src="`${VUE_APP_UPLOAD_BASE_URL}${generalDocsStore.document(loadingDocName)?.images_url[0]}`" />
        </div>
      </div>
    </div>
  </template>
  
<script setup>
  import { useGeneralCollectionStore } from '@/stores/generalDocsStore'
  import WheelSpinner from './WheelSpinner.vue'

  const loadingDocName = "loading"

  const VUE_APP_UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL

  const generalDocsStore = useGeneralCollectionStore()

  
</script>