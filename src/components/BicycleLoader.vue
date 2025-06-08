<template>
  <div class="bicycle-container">
    <div class="frame">
      <div class="top-tube"></div>
      <div class="down-tube"></div>
      <div class="seat-stay"></div>
      <div class="chain-stay"></div>
      <div class="head-tube"></div>
      <div class="seat-tube"></div>
      <div class="fork"></div>
      <div class="handlebar"></div>
      <div class="saddle"></div>
    </div>

    <div class="front-wheel-container">
      <WheelSpinner />
      <div class="axle"></div>
    </div>

    <div class="rear-wheel-container">
      <WheelSpinner />
      <div class="axle"></div>
    </div>

    <div class="pedal-system">
      <div class="crank-arm left">
        <div class="pedal"></div>
      </div>
      <div class="crank-arm right">
        <div class="pedal"></div>
      </div>
      <div class="bottom-bracket"></div>
    </div>
  </div>
</template>

<script setup>
import WheelSpinner from './WheelSpinner.vue'; // IMPORTANT: Adjust this path to your SpinningWheel.vue file
</script>

<style scoped>
/* Main container for the entire bicycle figure */
.bicycle-container {
  position: relative;
  width: 200px; /* Overall width of the bicycle */
  height: 250px; /* Overall height of the bicycle */
  /* border: 1px dashed #ccc; /* Optional: for debugging the container bounds */
  margin: 20px; /* Add some space around the component */
}

/* --- Frame Styling --- */
.frame {
  position: absolute;
  /* Adjust these values to shape your bicycle frame */
  width: 70%;
  height: 60%;
  top: 20%;
  left: 15%;
  /* background-color: rgba(128, 128, 128, 0.2); /* Optional: to visualize frame area */
}

/* Individual frame tubes (basic rectangles) */
.top-tube,
.down-tube,
.seat-stay,
.chain-stay,
.head-tube,
.seat-tube,
.fork {
  position: absolute;
  background-color: #333; /* Dark color for frame tubes */
  border-radius: 3px;
  height: 8px; /* Standard thickness for tubes */
}

.top-tube {
  width: 60%;
  top: 15%;
  left: 10%;
  transform: rotate(-10deg);
}

.down-tube {
  width: 65%;
  top: 35%;
  left: 15%;
  transform: rotate(20deg);
}

.seat-stay {
  width: 30%;
  top: 15%;
  right: 10%;
  transform: rotate(-30deg);
}

.chain-stay {
  width: 40%;
  bottom: 20%;
  left: 25%;
  transform: rotate(10deg);
}

.head-tube {
  width: 10px; /* Width for vertical tubes */
  height: 50px;
  top: 5%;
  left: 5%;
  transform: rotate(-75deg);
}

.seat-tube {
  width: 10px;
  height: 60px;
  top: 10%;
  right: 15%;
  transform: rotate(-15deg);
}

.fork {
  width: 8px;
  height: 60px;
  top: 35%;
  left: 8%;
  transform: rotate(15deg);
}

/* Handlebar and Saddle */
.handlebar {
  position: absolute;
  background-color: black;
  width: 40px;
  height: 6px;
  top: 0%;
  left: 0%;
  transform: translate(-20px, 0px) rotate(-10deg); /* Adjust for position relative to head-tube */
  border-radius: 3px;
}

.saddle {
  position: absolute;
  background-color: #8B4513; /* Brown color */
  width: 40px;
  height: 15px;
  top: 5%;
  right: 10%;
  border-radius: 8px 8px 0 0; /* Rounded top */
  transform: rotate(5deg);
}

/* --- Wheel Containers --- */
.front-wheel-container,
.rear-wheel-container {
  position: absolute;
  width: 25%; /* Explicit size for the wheel */
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: rgba(255, 0, 0, 0.1); /* Optional: to visualize wheel container area */
}

.front-wheel-container {
  left: 5%; /* Position relative to bicycle-container */
  bottom: 5%;
}

.rear-wheel-container {
  right: 5%; /* Position relative to bicycle-container */
  bottom: 5%;
}

.axle {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: #555; /* Dark gray for axle */
  border-radius: 50%;
  z-index: 1; /* Ensure axle is above the wheel's center */
}

/* --- Pedal System (Basic visual, not animated) --- */
.pedal-system {
  position: absolute;
  width: 60px; /* Width of the entire pedal area */
  height: 30px; /* Height of the entire pedal area */
  left: 35%; /* Position the pedal system */
  bottom: 15%;
  display: flex;
  justify-content: space-between; /* Space cranks evenly */
  align-items: center;
  /* border: 1px dashed green; /* Optional: for debugging pedal system area */
}

.crank-arm {
  width: 5px; /* Thickness of the crank arm */
  height: 30px; /* Length of the crank arm */
  background-color: #444; /* Darker gray */
  position: relative;
  border-radius: 3px;
}

.crank-arm.left {
  transform: rotate(-30deg); /* Example slight rotation for a more dynamic look */
}

.crank-arm.right {
  transform: rotate(30deg); /* Opposite rotation */
}

.pedal {
  width: 25px; /* Width of the pedal */
  height: 8px; /* Height of the pedal */
  background-color: #666; /* Gray for pedal */
  position: absolute;
  top: 50%; /* Position relative to crank arm */
  left: 50%;
  transform: translate(-50%, -50%); /* Centering on the crank arm */
  border-radius: 3px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.bottom-bracket {
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: black;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center the bottom bracket */
  z-index: 2; /* Ensure it's on top of cranks */
}
</style>