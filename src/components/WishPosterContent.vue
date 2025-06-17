<template>
    <div class="flex flex-col h-full justify-center items-start gap-4 relative"
    :class="{'sm:pt-[20%] md:pt-[20%] pt-[30%]' : displayRead}">
        <slot name="metadata" />
        <div v-if="displayRead" class="absolute top-0 left-0">
            <div v-if="wish.metadata?.read">
                <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-green-500">נקרא</span>
                </div>
            </div>
            <div v-else>
                <div class="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span class="text-gray-500">לא נקרא</span>
                </div>
            </div>
        </div>
        <div class="w-full h-full flex flex-col gap-2 overflow-y-hidden">
            <p :class="['text-right text-[18px] md:text-[20px] font-semibold truncate', nameTextSize]">{{ wish.name }}</p>
            <p :class="['text-right mt-1 text-[16px] md:text-[18px] font-light text-gray-700 w-[90%] break-words overflow-y-hidden', previewTextSize]">{{ previewText }}</p> <!-- Increased width to 90% for better flow -->
            <div v-if="wish?.images_url?.length && !isMobile" class="mt-2 self-center items-end">
                <Image class="w-10 h-10 text-gray-500" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Image } from 'lucide-vue-next'

const props = defineProps({
    wish: {
        type: Object,
        required: true
    },
    nameTextSize: {
        type: String,
        default: 'text-sm' // Default Tailwind class for name size
    },
    previewTextSize: {
        type: String,
        default: 'text-xs' // Default Tailwind class for preview text size
    },
    displayRead: {
        type: Boolean,
        default: false
    },
    charsDisplay: {
        type: Number,
        default: 30
    }
})

const isMobile = ref(window.innerWidth < 768)

const handleResize = () => {
    isMobile.value = window.innerWidth < 768
}

onMounted(() => {
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

const previewText = computed(() => {
    const chars = isMobile.value ? 30 : props.charsDisplay
    console.log("chars", chars)
    return props.wish.content?.slice(0, chars) + (props.wish.content?.length > chars ? '...' : '')
})
</script> 