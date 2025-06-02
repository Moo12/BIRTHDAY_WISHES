import { watch } from 'vue'
import { defineStore } from 'pinia'
import useFirestoreCollection from '@/composables/getCollection'

export const useGeneralCollectionStore = defineStore('GeneralCollection', {
  state: () => ({
    documents: [],
    loading: true,
    error: null,
  }),

  actions: {
    subscribe() {
      const {
        documents,
        error: collectionError,
        subscribeToCollection,
      } = useFirestoreCollection()

      subscribeToCollection('general')

      // Use a watcher to update store state reactively
      watch(
        () => documents.value,
        (newDocs) => {
          this.documents = newDocs;
          this.loading = newDocs ? newDocs.length === 0 : true

        },
        { immediate: true }
      )

      watch(
        collectionError,
        (err) => {
          if (err) {
            this.error = err
            this.loading = false
          }
        },
        { immediate: true }
      )
    },
  },
  getters: {
    document: (state) => (id) => state.documents?.find(doc => doc.id === id),
  }

})
