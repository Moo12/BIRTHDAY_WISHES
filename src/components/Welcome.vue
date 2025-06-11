<template>
    <div class="welcome-page-wrapper min-h-screen flex flex-col justify-between relative">
        <div v-if="!generalCollectionStore.loading && !generalCollectionStore.error" class="absolute h-screen inset-0 z-0">
            <ProtestAnimation class="absolute inset-0"
            :imageSources=generalCollectionStore.document(protestorsDocId)?.images_url
            :allowedAreas="[
            { xMin: 0, xMax: 90, yMin: 0, yMax: 20 },    // Top strip (top 0-20%)
            { xMin: 0, xMax: 90, yMin: 80, yMax: 100 },  // Bottom strip (bottom 20%)
            { xMin: 0, xMax: 20, yMin: 20, yMax: 80 },    // Left side (middle height, left 20%)
            { xMin: 80, xMax: 100, yMin: 20, yMax: 80 }   // Right side (middle height, right 20%)
        ]"
    
            uploadBaseUrl="https://bon-orledet.org/"/>
        </div>

        <div v-if="!generalCollectionStore.loading && !generalCollectionStore.error" class="absolute w-[20%] top-[30%] right-[8%]">
            <img class="w-full h-auto object-cover" :src="`${UPLOAD_BASE_URL}${generalCollectionStore.document(protestorsLoginDocId)?.images_url}`" />
        </div>
            
        <div class="w-full gap-10 my-[10%] flex flex-col justify-between items-center" name="text" 
            style="background-image: url('https://images.unsplash.com/photo-1541888946743-a65796b4618e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size: cover; background-position: center;">


            <div class="p-6 md:p-8 flex flex-col items-center justify-center overflow-hidden">
                <div class="top-[15%] left-[5%] md:top-[10%] md:left-[15%] bg-gray-800 border-blue-300 p-4 md:p-6 border-4 shadow-xl -rotate-3 transform origin-top-left rounded-lg md:rounded-xl">
                    <h1 class="text-4xl md:text-8xl font-bold drop-shadow-lg text-blue-300  whitespace-nowrap font-graffiti">
                        מהפכת שנות השבעים
                    </h1>
                </div>
        
                <div class="mt-6 right-[5%] md:top-[30%] md:right-[10%] bg-gray-800 p-3 md:p-4  border-blue-300 border-2 shadow-md rotate-6 transform origin-top-right rounded-md md:rounded-lg">
                    <p class="text-right md:text-4xl text-xl font-bold  drop-shadow-lg text-blue-300  border-blue-300 whitespace-nowrap font-graffiti">
                        הצטרפו לתנועה - קולכם חשוב!
                    </p>
                </div>
        
                <div class="self-start mr-12 bottom-[20%] left-[5%] md:bottom-[15%] md:left-[10%] bg-gray-800 border-blue-300 p-3 md:p-4 border-2 shadow-md -rotate-4 transform origin-bottom-left rounded-md md:rounded-lg">
                    <p class="text-right text-xl md:text-4xl font-bold drop-shadow-lg  border-blue-300 text-blue-300 whitespace-nowrap font-graffiti">
                        כי רק ביחד ננצח!
                    </p>
                </div>
            </div>

            <div>
                <div class="flex justify-center" v-if="!user">
                    <div class="btn bg-red-600 hover:bg-red-700 p-4 md:p-5 border-4 border-red-800 shadow-xl  origin-bottom-right rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                        @click="loginWithGoogle(); console.log('login click')">
                        <button
                                class="text-right btn flex items-center justify-center gap-2 text-white text-lg md:text-xl font-semibold w-full h-full">
    
                            <p class="text-center leading-tight">הצטרפו למחאה <br>ולחצו פה (התחברות ללא סיסמא )</p>
                        </button>
                    </div>
                </div>
                <div v-else class="w-full flex justify-center">
                    <AddWish @wish-added="onAddWish" colorScheme="pink" hoverEffect="dark-to-light" />
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
    import { useRouter } from 'vue-router'
    import ProtestAnimation from '@/components/ProtestorsAnimation'
    import { useGeneralCollectionStore } from '@/stores/generalDocsStore'
    import AddWish from '@/components/AddWish.vue'

    import useAuth from '@/composables/useAuth'

    const router = useRouter()
    const generalCollectionStore = useGeneralCollectionStore()
    
    const protestorsDocId = "protestors_welcome_page"
    const protestorsLoginDocId = "login-page"
    
    const UPLOAD_BASE_URL = process.env.VUE_APP_UPLOAD_BASE_URL;
    
    const { user, loginWithGoogle } = useAuth()

    function onAddWish() {
        router.push('/all-wishes')
    }

</script>