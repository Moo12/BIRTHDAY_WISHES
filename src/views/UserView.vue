<template>
    <div class="">
        <div v-if="isLoading">
            <LoaderWrapper />
        </div>
        <div v-else>
            <WishesWall class="w-full h-full"/>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue"
import { useConfigStore } from '@/stores/configStore'
import { useWishlistStore } from '@/stores/wishListStore'
import WishesWall from '@/components/WishesWall.vue'
import LoaderWrapper from '@/components/LoaderWrapper.vue'


const configStore = useConfigStore()
const wishlistStore = useWishlistStore()

const isLoading = computed(() => {
    if (configStore && wishlistStore) {
        return configStore.loading || wishlistStore.loading
    }
    return true
})



</script>
