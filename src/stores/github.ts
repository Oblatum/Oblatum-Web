import { defineStore } from 'pinia'

export const useGithubStore = defineStore('github', {
    state: () => ({
        proxy:"https://gh.api.99988866.xyz/",
        url:"https://raw.githubusercontent.com/Oblatum/Oblatum-IconPack-Reborn/master/"
    })

});