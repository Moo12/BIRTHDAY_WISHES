<template>
    <div
      class="bg-yellow-100 shadow-md p-4 w-full max-w-[220px] rounded break-words cursor-pointer hover:scale-105 transition-transform duration-200"
      :style="randomStyle"
      @click="$emit('open', wish.id)"
    >
      <p class="text-sm font-semibold">{{ wish.name }}</p>
      <p class="text-xs mt-1 text-gray-700">{{ previewText }}</p>
    </div>
  </template>
  
  <script setup>
  import {computed} from 'vue'

  const props = defineProps({
    wish: {
        type: Object,
        required: true
        },
    });

  
  const previewText = computed(() =>
    props.wish.content?.slice(0, 80) + (props.wish.content?.length > 80 ? '...' : '')
  )
  
  // Add some rotation/random poster-like feel
  const tiltOptions = ['rotate-[-2deg]', 'rotate-[1deg]', 'rotate-[3deg]', 'rotate-[-1deg]']
  const randomTilt = tiltOptions[Math.floor(Math.random() * tiltOptions.length)]
  
  const colorOptions = ['bg-yellow-100', 'bg-pink-100', 'bg-blue-100', 'bg-green-100']
  const color = colorOptions[Math.floor(Math.random() * colorOptions.length)]
  
  const randomStyle = {
    transform: `rotate(${[-2, -1, 1, 2][Math.floor(Math.random() * 4)]}deg)`
  }
  </script>
  