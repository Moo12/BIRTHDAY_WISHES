import { watch, computed } from 'vue'
import { defineStore } from 'pinia'
import useFirestoreCollection from '@/composables/getCollection'

// Removed direct import of useAuth here to keep the store more decoupled.
// The currentUserUid will be set via an action.

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    documents: [],
    loading: true,
    error: null,
    currentFilter: 'all', // 'all', 'mine', 'public'
    currentReadFilter: 'all', // 'all', 'read', 'unread'
    currentNameFilter: '', // Search string for name filter
    currentUserUid: null, // To store the UID of the currently logged-in user
  }),

  getters: {
    visibleWishes(state) {
      let filtered = state.documents;

      // Filter by button (all/mine/public)
      if (state.currentFilter === 'mine') {
        // Only show wishes by the current user if their UID is set
        if (state.currentUserUid) {
          filtered = filtered.filter(doc => doc.user === state.currentUserUid);
        } else {
          // If 'mine' is selected but no user is logged in, show nothing
          filtered = [];
        }
      } else if (state.currentFilter === 'public') {
        // Show only public wishes
        filtered = filtered.filter(doc => doc.public === true || doc.user === state.currentUserUid);
      } else {
        // 'all': show own + public. This implies a user might be logged in.
        // If user is NOT logged in, 'all' should effectively show only public.
        console.log("all public and private wishes")
      }

      // Filter by read status
      if (state.currentReadFilter === 'read') {
        filtered = filtered.filter(doc => doc.metadata?.read === true);
      } else if (state.currentReadFilter === 'unread') {
        filtered = filtered.filter(doc => !doc.metadata?.read);
      }

      // Filter by name
      if (state.currentNameFilter && state.currentNameFilter.trim() !== "") {
        const search = state.currentNameFilter.trim().toLowerCase();
        filtered = filtered.filter(doc => (doc.name || "")?.toLowerCase().includes(search));
      }
      
      return filtered;
    }
  },

  actions: {
    subscribe() {
      // This action remains responsible for setting up the Firestore subscription
      // and updating the 'documents' state.
      const {
        documents,
        error: collectionError,
        subscribeToCollection,
      } = useFirestoreCollection()

      // Example subscription (assuming 'wishes' collection)
      subscribeToCollection('wishes', [], { field: 'metadata.created_at', order: 'desc' });

      // Watch Firestore documents and update store state reactively
      watch(
        () => documents.value,
        (newDocs) => {
            this.documents = newDocs || [] // Ensure it's an array
            // Update loading state based on initial load completion
            this.loading = newDocs === null // True if documents is still null (initial state)
        },
        { immediate: true }
      )

      // Watch for collection errors
      watch(
        collectionError,
        (err) => {
          if (err) {
            this.error = err
            this.loading = false // Stop loading on error
            console.error("Wishlist store: Firestore collection error", err)
          }
        },
        { immediate: true }
      )
    },

    /**
     * Sets the primary filter type for the wishlist.
     * @param {string} filterType - 'all', 'mine', or 'public'.
     */
    setFilter(filterType) {
      if (['all', 'mine', 'public'].includes(filterType)) {
        this.currentFilter = filterType;
        console.log(`Wishlist filter set to: ${filterType}`);
      } else {
        console.warn(`Invalid filter type: '${filterType}'. Keeping current filter.`);
      }
    },

    /**
     * Sets the primary filter type for the wishlist.
     * @param {string} filterType - 'all', 'mine', or 'public'.
     */
    setReadFilter(filterType) {
      if (['read', 'unread', 'all'].includes(filterType)) {
        this.currentReadFilter = filterType;
        console.log(`Wishlist read filter set to: ${filterType}`);
      } else {
        console.warn(`Invalid filter type: '${filterType}'. Keeping current filter.`);
      }
    },

    /**
     * Sets the name filter string for searching wishes.
     * @param {string} name - The search string.
     */
    setNameFilter(name) {
      this.currentNameFilter = name || ''; // Ensure it's a string, default to empty
      console.log(`Wishlist name filter set to: '${this.currentNameFilter}'`);
    },

    /**
     * Sets the current user's UID in the store, used for 'mine' filter.
     * This should be called from a component that has access to the authenticated user's UID.
     * @param {string | null} uid - The user's Firebase UID, or null if unauthenticated.
     */
    setUserUid(uid) {
        if (this.currentUserUid !== uid) {
            this.currentUserUid = uid;
            console.log(`Wishlist store user UID set to: ${uid ? 'authenticated' : 'null'}`);
        }
    }
  },
})
