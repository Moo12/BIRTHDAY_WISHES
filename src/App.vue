<template>
  <div class="" dir="rtl">
    <Navbar/>
  </div>
  <div class="md:min-h-[80vh] min-h-[90vh]" dir="rtl">
    <router-view/>
  </div>
</template>

<script setup>
import { watch } from 'vue'

import Navbar from './components/Navbar.vue';
import { onMounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useWishlistStore } from '@/stores/wishListStore'
import { useGeneralCollectionStore } from '@/stores/generalDocsStore'

const configStore = useConfigStore()
const wishlistStore = useWishlistStore()
const generalDocsStore = useGeneralCollectionStore()

onMounted(() => {
  configStore.fetchConfig()
  wishlistStore.subscribe()
  generalDocsStore.subscribe()
})

</script>

<style>
</style>
