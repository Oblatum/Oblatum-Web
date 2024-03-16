import { defineStore } from 'pinia'

export const useGithubStore = defineStore('github', {
    state: () => ({
        proxy:"https://gh.api.99988866.xyz/",
        //proxy:"https://hub.gitmirror.com/",
        url:"https://raw.githubusercontent.com/Oblatum/Oblatum-IconPack-Reborn/master/"
    }),
    getters: {
        getGithubUrl():string{
            // return this.url.replace("raw.githubusercontent.com","raw.staticdn.net");
            return this.proxy + this.url;
        }
    }

});
