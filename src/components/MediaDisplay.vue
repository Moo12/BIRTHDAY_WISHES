<template>
    <div class="media-container" @click="$emit('click')">
        <!-- Image Display -->
        <img
            v-if="isImage"
            :src="fullUrl"
            :alt="alt"
            class="media-element"
            @error="handleError"
        />
        <!-- Video Display -->
        <div v-else-if="isVideo" class="relative w-full h-full">
            <video
                :src="fullUrl"
                class="media-element"
                :controls="controls"
                @error="handleError"
                @click.stop="handleVideoClick"
            ></video>
            <!-- Video Icon Overlay -->
            <div v-if="!controls" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                </svg>
            </div>
        </div>
        <!-- Fallback for unsupported types -->
        <div v-else class="media-error">
            <span class="text-red-500">Unsupported media type</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        default: 'Media content'
    },
    controls: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['error', 'click'])

console.log("props.src", props.src)

// Get base URL from environment variable
const UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL


console.log("UPLOAD_BASE_URL", UPLOAD_BASE_URL)
// Compute the full URL
const fullUrl = computed(() => {
    if (!props.src) return ''
    return `${UPLOAD_BASE_URL}${props.src}`
})

// Check if the file is an image
const isImage = computed(() => {
    if (!props.src) return false
    const extension = props.src.split('.').pop().toLowerCase()
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)
})

// Check if the file is a video
const isVideo = computed(() => {
    if (!props.src) return false
    const extension = props.src.split('.').pop().toLowerCase()
    return ['mp4', 'webm', 'ogg'].includes(extension)
})

// Handle media loading errors
const handleError = (error) => {
    console.error('Media loading error:', error)
    emit('error', {
        path: props.src,
        error: error
    })
}

// Handle video click
const handleVideoClick = (event) => {
    if (!props.controls) {
        event.preventDefault()
        event.stopPropagation()
        emit('click')
    }
}
</script>

<style scoped>
.media-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
}

.media-element {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    object-fit: cover;
}

.media-error {
    padding: 1rem;
    text-align: center;
    background-color: #fef2f2;
    border-radius: 0.375rem;
    width: 100%;
}

/* Add hover effect for the video icon */
.media-container:hover .bg-opacity-30 {
    background-opacity: 0.4;
}
</style> 