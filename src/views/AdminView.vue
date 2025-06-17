<template>
    <div class="flex flex-col h-full mt-[4%] gap-6">
        <!-- Main Content (Changes Based on Route) -->
        <div class="flex-1 p-4">
            <router-view />
        </div>
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
