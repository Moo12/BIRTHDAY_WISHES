<template>
    <div class="space-y-4">
      <h2 class="text-xl font bold text-center">Manage Image Sections</h2>
      
      <div v-if="generalCollectionStore.documents" class="flex flex-wrap gap-2">
        <button
          v-for="doc in generalCollectionStore.documents"
          :key="doc.id"
          class="px-3 py-1 bg-blue-200 rounded"
          :class="{ 'bg-blue-400': currentDoc?.id === doc.id}"
          @click="currentDoc = doc"
        >
          {{ doc.id }}
        </button>
      </div>
  
      <form @submit.prevent="createNewDoc" class="flex gap-2 mt-2">
        <input v-model="newDocId" placeholder="New section ID" class="border px-2 py-1 rounded" />
        <button type="submit" class="bg-green-300 px-3 py-1 rounded">Create</button>
      </form>
  
      <hr class="my-4" />
  
      <AdminImagesSection
        v-if="currentDoc"
        :key="currentDoc.id"
        :document="currentDoc"
        @upload="handleUpload"
      />

      <div>
        {{msgLabel}}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import useCollection from '@/composables/useCollection'
  import AdminImagesSection from './AdminImagesSection.vue';
  import { useGeneralCollectionStore } from '@/stores/generalDocsStore'

  const generalCollectionStore = useGeneralCollectionStore()
  
  const { addDocImp } = useCollection()
  
  const newDocId = ref('');

  const currentDoc = ref(null)

  const msgLabel = ref('')

  console.log("admin image manager")


  // Create a new document in general/images/{newDocId}
  const createNewDoc = async () => {
    if (!newDocId.value.trim()) return;

    const doc = {
            images_url: [],
    }
    
    try {
        let docRef = await addDocImp("general", doc , newDocId.value)
        if (!docRef){
            console.error("Error creating new doc:", err);
        }
        newDocId.value = '';
    } catch (err) {
      console.error("Error creating new doc:", err);
      msgLabel.value = "שגיאה ביצירת קטגוריה נוספת"
    }
  };

  const handleUpload = (response) => {
    console.log("handleUpload", response)
    if (response.status === "success"){
        const doc = {
            images_url: response.data.images,
        }

        addDocImp("general", doc, currentDoc.value.id)
    }
    else{
        console.error("error update images")

    }

}
  </script>
  