<template>
        <!-- Main Content (Changes Based on Route) -->
    <div class="">
        <router-view />
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useWishlistStore } from '@/stores/wishListStore'
import useAuth from '@/composables/useAuth'

const wishlistStore = useWishlistStore()
const { user } = useAuth()

onMounted(() => {
    wishlistStore.setUserUid(user.value?.uid || null)

    wishlistStore.setReadFilter('all')
    wishlistStore.setFilter('all')
})


</script>