<template>
    <div class="w-full h-full">
        <Welcome />
    </div>
</template>

<script setup>

    import { watchEffect } from 'vue';

    import Welcome from '@/components/Welcome.vue';
    import { useRouter } from 'vue-router';
    import useAuth from '@/composables/useAuth';

    const { user, loginWithGoogle } = useAuth()
    
    const router = useRouter()
    
    watchEffect(() => {
        if (user.value) {
            router.push("/")
        }
    })

</script>