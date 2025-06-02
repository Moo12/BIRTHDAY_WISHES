<template>
    <div class="protest-animation-container relative w-full h-full overflow-hidden">
      <div class="absolute inset-0 bg-black bg-opacity-20 z-0"></div>
  
      <transition-group name="protestor-fade-slide" tag="div">
        <div
          v-for="protestor in activeProtestors"
          :key="protestor.id"
          class="protestor-character absolute"
          :style="{
            left: protestor.x + '%',
            bottom: protestor.y + '%',
            zIndex: protestor.z, // For overlapping effect
            transform: `scale(${protestor.scale})` // Add slight scale variation
          }"
        >
          <img :src="`${uploadBaseUrl}${protestor.src}`" :alt="protestor.alt" 
          class="max-w-[80px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[250px] h-auto object-contain" />
        </div>
      </transition-group>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
    // Define props to accept availableProtestors
    const props = defineProps({
        imageSources: {
        type: Array,
        required: true,
        default: () => [] // Provide a default empty array
        },
        uploadBaseUrl: { type: String, required: true },
    });

    const availableProtestors = ref([]);
    const activeProtestors = ref([]);
    let spawnInterval = null;
    const maxProtestors = ref(10); // Max number of protestors on screen at once
  
    const setMaxProtestors = () => {
        if (window.innerWidth < 768) { // Example breakpoint for mobile (Tailwind's 'md')
            maxProtestors.value = 10; // Fewer protestors on mobile
        } else {
            maxProtestors.value = 30;
        }

        console.log("max protestors", maxProtestors.value)
        console.log("uploadBaseUrl", props.uploadBaseUrl)
    };

  
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomFloat = (min, max) => Math.random() * (max - min) + min;
  
  const spawnProtestor = () => {
    if (activeProtestors.value.length >= maxProtestors.value) {
      // Optionally remove oldest protestor to make room for new ones,
      // or stop spawning if you want a fixed number.
      // For a "growing crowd" feeling, let's keep adding and remove oldest.
      activeProtestors.value.shift(); // Remove the first (oldest) protestor
    }
  
    const randomIndex = getRandomInt(0, availableProtestors.value.length - 1);
    const selectedProtestor = availableProtestors.value[randomIndex];

  
    activeProtestors.value.push({
      ...selectedProtestor,
      id: Date.now() + Math.random(), // Ensure unique ID for transition-group
      x: getRandomInt(5, 95),       // Random X position (percentage from left)
      y: getRandomInt(5, 70),       // Random Y position (percentage from bottom - keeps them off the very top)
      z: getRandomInt(1, maxProtestors), // Random z-index for overlapping effect
      scale: getRandomFloat(0.8, 1.2) // Slight scale variation
    });
  };
  
  onMounted(() => {
    setMaxProtestors(); // Set on initial load
    window.addEventListener('resize', setMaxProtestors); // Adjust on resize

     // build availableProtestors from the prop `imageSources`
    availableProtestors.value = props.imageSources?.map((src, index) => ({
        id: index, // Simple unique ID
        src: src,
        alt: `Protestor image ${index + 1}` // Generic alt text, could be passed as another prop if needed
    }));

    console.log("availableProtestors", availableProtestors.value)

    if (availableProtestors.value.length === 0) {
        console.warn("ProtestAnimation received no image sources. Animation will not start.");
        return;
  }

    // Spawn initial few protestors quickly to start the scene
    for (let i = 0; i < 3; i++) {
      setTimeout(spawnProtestor, getRandomInt(100, 500) * i);
    }
  
    // Then set a recurring interval for new protestors
    spawnInterval = setInterval(spawnProtestor, getRandomInt(800, 2500)); // Spawn every 0.8 to 2.5 seconds
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', setMaxProtestors);

    if (spawnInterval) {
      clearInterval(spawnInterval);
    }
  });
  </script>
  
  <style scoped>
  /* Container for the animation */
  .protest-animation-container {
    min-height: 400px; /* Adjust as needed */
    background-image: url(''); /* Optional: a subtle background */
    background-size: cover;
    background-position: center;
  }
  
  /* Base styles for the protestor characters */
  .protestor-character {
    transition: all 1s ease-out; /* Smooth transition for position and scale */
  }
  
  /* Vue Transition Group Styles */
  .protestor-fade-slide-enter-active {
    transition: all 1s ease-out; /* Match .protestor-character for consistency */
  }
  .protestor-fade-slide-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
    position: absolute; /* Needed for leave transition when items are removed from list */
  }
  
  .protestor-fade-slide-enter-from,
  .protestor-fade-slide-leave-to {
    opacity: 0;
    transform: translateY(50px) scale(0.5); /* Start lower and smaller, fade in */
  }
  
  /* Ensure moving items are animated out smoothly */
  .protestor-fade-slide-move {
    transition: transform 1s ease-out;
  }
  </style>