import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIconsStore = defineStore('icons', {
    state: () => ({
        allIcons: ref<string[]>([]),
        newIcons: ref<string[]>([])
    }),

})