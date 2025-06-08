<template>
    <div class="my-4 md:my-6">
        <div v-if="isLoading">
            <SpinnerWrapper />
        </div>
        <div v-else>
            <WishesWall class="w-full"/>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useConfigStore } from '@/stores/configStore'
import { useWishlistStore } from '@/stores/wishListStore'
import WishesWall from '@/components/WishesWall.vue'
import SpinnerWrapper from '@/components/SpinnerWrapper.vue'


const configStore = useConfigStore()
const wishlistStore = useWishlistStore()

const isLoading = computed(() => {
    if (configStore && wishlistStore) {
        return configStore.loading || wishlistStore.loading
    }
    return true
})



</script>
