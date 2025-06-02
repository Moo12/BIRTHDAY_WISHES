<template>
    <div class="flex flex-col h-full mt-[4%] gap-6">
        <p class="text-right">אדמין איחולים</p>

        <!-- Main Content (Changes Based on Route) -->
        <div class="flex-1 p-4">
            <router-view />
        </div>
    </div>
</template>

<script setup>
import WishesList from '@/components/WishesList.vue'
</script>
