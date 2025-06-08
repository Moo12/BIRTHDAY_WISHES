<template>
    <div class="wheel-spinner rounded-full border-2 relative aspect-square w-full m-auto flex justify-center items-center" 
    role="status" aria-label="Loading">
      <div
        v-for="n in spokesCount"
        :key="n"
        class="spoke bg-red-600"
        :style="{
          transform: `rotate(${(n - 1) * angle}deg)`,
        }"
      >
      </div>
      <div class="hub"></div>
    </div>
  </template>
  
  <script setup>
  const spokesCount = 12
  const angle = 360 / spokesCount
  </script>
  
  <style scoped>
  .wheel-spinner {
    animation: spin 1.2s linear infinite;
  }
  
  .spoke {
    position: absolute;
    width: 2px;
    height: 50%;
    top: 0;
    left: 50%;
    transform-origin: bottom center; /* Pivot from base of spoke */
    border-radius: 1px;
  }
  
  /* Center hub dot */
  .hub {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #444;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
  
  /* Full spinner rotation */
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
  </style>
  