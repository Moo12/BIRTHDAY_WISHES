<template>
    <div v-if="isLoading">
        <LoaderWrapper/>
    </div>
    <div v-else class="w-full h-full">
        <Welcome />
    </div>
</template>

<script setup>

    import { watchEffect, computed } from 'vue';

    import { useGeneralCollectionStore } from '@/stores/generalDocsStore';
    import Welcome from '@/components/Welcome.vue';
    import LoaderWrapper from '@/components/LoaderWrapper.vue';
    import { useRouter } from 'vue-router';
    import useAuth from '@/composables/useAuth';

    const { user } = useAuth()
    
    const router = useRouter()
    
    const generalDocsStore = useGeneralCollectionStore()

    const isLoading = computed(() => {
        if (generalDocsStore) {
            return generalDocsStore.loading
        }
        
        return true
    })

    watchEffect(() => {
        if (user.value) {
            router.push("/")
        }
    })

</script>