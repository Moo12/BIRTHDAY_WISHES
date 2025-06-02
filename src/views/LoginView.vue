<template>
    <div class="welcome-page-wrapper min-h-screen flex flex-col justify-between">
        <div v-if="!generalCollectionStore.loading && !generalCollectionStore.error" class="relative h-screen">
            <ProtestAnimation class="absolute inset-0" :imageSources=generalCollectionStore.document(protestorsDocId)?.images_url 
            :uploadBaseUrl="UPLOAD_BASE_URL"/>
        </div>
            
        <div class="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 text-white text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">מהפכת שנות השבעים</h1>
            <p class="text-xl md:text-2xl font-bold mb-8 drop-shadow-lg">הצטרפו לקול העם וכתבו ברכה ליומלדת הולדתה השבעים של אורלי</p>
            <button @click="loginWithGoogle"
                    class="btn z-10 flex items-center gap-1 text-gray-500 bg-gray-100  px-4 py-2 border-2 rounded-md border-gray-400   md:text-[18px] text-base">
                התחבר.י
            </button>
        </div>
    </div>
</template>

<script setup>
    import { watch } from 'vue' 
    import { useRouter } from 'vue-router';
    import useAuth from '@/composables/useAuth'
    import ProtestAnimation from '@/components/ProtestorsAnimation'
    import { useGeneralCollectionStore } from '@/stores/generalDocsStore'

    const router = useRouter()
    const { user, loginWithGoogle } = useAuth()

    const generalCollectionStore = useGeneralCollectionStore()

    const protestorsDocId = "protestors_welcome_page"

    const UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;


    watch(() => {
        if (user.value){
            router.push("/")
        }
    })

</script>