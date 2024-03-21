import { defineStore } from 'pinia'

export const useGithubStore = defineStore('github', {
    state: () => ({
        proxy:["https://gh.api.99988866.xyz/","https://hub.gitmirror.com/"],
        proxy2:"https://cdn.jsdelivr.net/gh/",
        url:"https://raw.githubusercontent.com/Oblatum/Oblatum-IconPack-Reborn/master/"
    }),
    getters: {
        getGithubUrl():string{
            // return this.url.replace("raw.githubusercontent.com","raw.staticdn.net");
            //66%的概率使用proxy，33%的概率使用proxy2
            const random = Math.random();
            if(random<0.66){
                return this.proxy[Math.floor(Math.random()*this.proxy.length)]+this.url;
            }
            return this.proxy2+this.url.split("com/")[1].split("/master")[0]+"@master/";
        }
    }

});
