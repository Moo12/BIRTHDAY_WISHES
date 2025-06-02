import { defineStore } from 'pinia'
import { getConfig } from '@/composables/getConfig'

export const useConfigStore = defineStore('config', {
  state: () => ({
    config: null,
    loading: true,
    error: null,
  }),

  actions: {
    async fetchConfig() {
      this.loading = true
      this.error = null

      try {
        const response = await getConfig()
        if (response.success) {
          this.config = response.data
        } else {
          this.error = 'Failed to load config'
        }
      } catch (err) {
        console.error(err)
        this.error = 'Unexpected error'
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    maxImagesPerWish: (state) => state.config?.max_images_per_wish || 5,
    maxWishesPerUser: (state) => state.config?.max_wishes_per_user || 3
  }
})
