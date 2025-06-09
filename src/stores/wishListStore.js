import { watch } from 'vue'
import { defineStore } from 'pinia'
import useFirestoreCollection from '@/composables/getCollection'

export const useWishlistStore = defineStore('wishlist', {
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

      subscribeToCollection('wishes', [], { field: 'metadata.created_at', order: 'desc' });

      // Use a watcher to update store state reactively
      watch(
        () => documents.value,
        (newDocs) => {
            console.log("newDocs", newDocs)
          this.documents = newDocs
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
})
