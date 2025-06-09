<template>
    <div v-if="isLoading">
        <LoaderWrapper/>
    </div>
    <div v-else class="w-full">
        <Welcome />
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import Welcome from '@/components/Welcome.vue';
    import { useGeneralCollectionStore } from '@/stores/generalDocsStore';
    import LoaderWrapper from '@/components/LoaderWrapper.vue';

    const generalDocsStore = useGeneralCollectionStore()

    const isLoading = computed(() => {
        if (generalDocsStore) {
            return generalDocsStore.loading
        }
        
        return true
    })

</script>