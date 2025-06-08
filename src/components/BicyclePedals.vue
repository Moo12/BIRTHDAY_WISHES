<template>
  <div class="bicycle-pedals-container">
    <div class="pedal-system" :style="{ transform: 'rotate(' + rotation + 'deg)' }">
      
      <div class="crank-arm crank-arm-one">
        <div class="pedal"></div>
      </div>

      <div class="crank-arm crank-arm-two">
        <div class="pedal"></div>
      </div>
      
      <div class="center-pivot"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const rotation = ref(0);
const animationFrameId = ref(null);
const lastTime = ref(null);
const speed = 800;

const stopAnimation = () => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
};

const animate = (currentTime) => {
  if (lastTime.value === null) {
    lastTime.value = currentTime;
  }
  const deltaTime = (currentTime - lastTime.value) / 1000; 
  rotation.value = (rotation.value + speed * deltaTime) % 360;
  lastTime.value = currentTime;
  animationFrameId.value = requestAnimationFrame(animate);
};

const startAnimation = () => {
  lastTime.value = performance.now();
  animationFrameId.value = requestAnimationFrame(animate); 
};

onMounted(() => {
  startAnimation();
});

onBeforeUnmount(() => {
  stopAnimation();
});
</script>

<style scoped>
.bicycle-pedals-container {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  /* border: 1px dashed #ccc; /* For debugging container */
}

.pedal-system {
  position: absolute;
  width: 150px; /* This div controls the overall diameter of the pedal rotation */
  height: 150px;
  transform-origin: center center; /* This div rotates around its center */
  /* Optional: background-color: rgba(0, 0, 255, 0.1); for debugging its area */
}

.crank-arm {
  position: absolute;
  width: 75px; /* Length of a single crank arm (half of pedal-system width) */
  height: 8px; /* Thickness of the crank arm */
  background-color: #333; /* Dark gray */
  border-radius: 4px;
  top: 50%; /* Vertically align its top edge to the center of pedal-system */
  transform-origin: 0% 50%; /* Pivot point is at the 'left' end of the crank arm (where it connects to the axle) */
}

.crank-arm-one {
  left: 50%; /* Position its pivot point (left edge) at the center of pedal-system */
  transform: translateY(-50%) rotate(0deg); /* Initial rotation: points right, centered vertically */
}

.crank-arm-two {
  width: 60%;
  left: 50%; /* Position its pivot point (left edge) at the center of pedal-system */
  transform: translateY(-50%) rotate(120deg); /* Initial rotation: points left, centered vertically */
}

.pedal {
  width: 40px;
  height: 12px;
  background-color: #555;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  
  /* Position pedal at the *end* of its crank arm */
  position: absolute;
  top: 50%;
  right: -20px; /* Half of pedal width, extending beyond the crank arm's end */
  transform: translateY(-50%); /* Centers the pedal vertically relative to its arm */
  /* Note: The pedal itself will rotate with its crank arm.
     If you wanted the pedal to *stay horizontal* relative to the screen,
     you would need to apply a counter-rotation transform here
     like `transform: translateY(-50%) rotate(-` + rotation.value + `deg);`
     but that's more complex and usually not done for simple pedal animations. */
}

.center-pivot {
  width: 15px;
  height: 15px;
  background-color: #e74c3c;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Perfect centering of the circle */
  z-index: 10;
  border: 2px solid #c0392b;
}
</style>