<template>
  <div class="fixed inset-0 bg-black/70 z-[150] w-full h-[100vh]  overflow-y-auto flex items-center">
    <div class="relative flex flex-col my-auto  md:w-[60%] w-[90%] mx-auto rounded-xl  shadow-md overflow-hidden border-2 bg-gray-100">
      <button
        class="mt-2 ml-2 self-end font-semibold text-gray-600 hover:bg-gray-300 p-2 rounded-lg text-xl"
        @click="$emit('close')"
      >
        ✕
      </button>
      <div class="mb-[5%] mx-[10%]">
        <component
          :is="component"
          v-bind="componentProps"
          @edit="$emit('edit', $event)"
          @remove="$emit('remove', $event)"
          @cancel="$emit('close')"
          @save="$emit('save', $event); console.log('save modal wrraper')"
        />
      </div>

    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  component: Object,       // the component to render dynamically
  componentProps: Object   // props to pass to the dynamic component
})

const emit = defineEmits(['close', 'edit', 'save', 'remove'])
</script>

<style scoped>
</style>
