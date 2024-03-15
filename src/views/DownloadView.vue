<template>
    <div class="flex flex-col gap-4 md:gap-6 justify-center items-center">
        <div class="flex gap-8 self-baseline w-full">
            <img class="w-32 h-32 self-end rounded-6 shadow-md hover:shadow-xl transition-all" alt=""
                :src="githubUrl + 'app/src/main/ic_launcher-playstore.png'" />
            <div class="grow">
                <p class="opacity-85 text-xl">Oblatum 图标</p>
                <p class="opacity-65 capitalize">{{ version }}</p>
                <mdui-button full-width class="w-full" :href="download_url" target="_blank">
                    <mdui-icon slot="icon" name="downloading--outlined"></mdui-icon>
                    下载
                </mdui-button>
            </div>

        </div>
        <mdui-card variant="outlined" class="w-full p-0">
            <mdui-list class="p-0 grid grid-cols-2 opacity-55">
                <mdui-list-item>
                    <div class="flex flex-col items-center py-1">
                        <p class="m-0">{{ download_count }}次</p>
                        <p class="m-0 font-black text-sm scale-75">下载</p>
                    </div>
                </mdui-list-item>
                <mdui-list-item>
                    <div class="flex flex-col items-center py-1">
                        <p class="m-0">{{ icons_count }}个</p>
                        <p class="m-0 font-black text-sm scale-75">图标</p>
                    </div>
                </mdui-list-item>
            </mdui-list>
        </mdui-card>

        <mdui-card class="w-full p-4">
            <h3 class="mt-0 opacity-85">更新日志 <span class="text-sm text-end opacity-55 font-normal">{{ update_time
                    }}</span></h3>
            <mdui-divider></mdui-divider>
            <p v-for="(item, index) in change_log" :key="index" class="opacity-75">{{ index + 1 }}、{{ item }}</p>
        </mdui-card>

        <mdui-card class="w-full p-4" v-if="new_icons.length != 0">
            <h3 class="mt-0 opacity-85">图标变动</h3>
            <mdui-divider></mdui-divider>
            <mdui-list class="pt-0 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                <mdui-list-item v-for="(item, index) in new_icons" :key="index">
                    <OblatumContentIcon :iconUrl="'res/drawable-nodpi/'+item" />
                </mdui-list-item>
            </mdui-list>
        </mdui-card>
        <Transition>
            <div v-if="state < 3 && state >= 0"
                class="fixed w-full h-full bg-[rgba(var(--mdui-color-secondary-container),0.4)] top-0 left-0 flex flex-col justify-center items-center backdrop-blur-3xl backdrop-brightness-115 dark:backdrop-brightness-50">
                <mdui-circular-progress></mdui-circular-progress>
                <p class="text-xl opacity-60 mb-1">正在拉取数据...</p>
                <p class="text-xs opacity-60 mt-0">Fetching data...</p>
            </div>
        </Transition>
        <Transition>
            <div v-if="state < 0"
                class="fixed w-full h-full bg-[rgba(var(--mdui-color-secondary-container),0.4)] top-0 left-0 flex flex-col justify-center items-center backdrop-blur-3xl backdrop-brightness-115 dark:backdrop-brightness-50">
                <mdui-icon-error class="text-[3rem] text-[rgba(var(--mdui-color-error))]"></mdui-icon-error>
                <p class="text-xl opacity-60 mb-1">获取数据异常</p>
                <p class="text-xs opacity-60 mt-0">Failed to fetch data, code:{{ state }}.</p>
                <p class="text-xs mt-0 text-[rgba(var(--mdui-color-secondary))]">刷新试试？</p>
            </div>
        </Transition>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import OblatumContentIcon from '@/components/icons/OblatumContentIcon.vue';
import { useGithubStore } from '@/stores/github';
import { useIconsStore } from '@/stores/icons';
const icons = useIconsStore()
const githubUrl = useGithubStore().getGithubUrl
let version = ref('NaN')
let update_time = ref('NaN')
let change_log = ref([])
let new_icons = ref([])
let icons_count = ref(0)
let download_url = ref('')
let download_count = ref(0)
let state = ref(0)
/**从https://gh.api.99988866.xyz/https://raw.githubusercontent.com/Oblatum/Oblatum_IconPack/master/app/build.gradle获取版本号**/
const getVerson = async () => {
    const response = await fetch('https://api.github.com/repos/Oblatum/Oblatum-IconPack-Reborn/releases')
    let text = await response.text()
    text = JSON.parse(text)
    //如果text[0]不存在，说明没有release，直接返回
    if (!text[0]) {
        state.value += -90
        return
    }
    //截取versionName开头，换行符结尾的字符串
    version.value = text[0].tag_name
    update_time.value = new Date(text[0].assets[0].updated_at).toLocaleString()
    download_url.value = text[0].assets[0].browser_download_url
    download_count.value = text[0].assets[0].download_count
    state.value++
}

const getChangeLog = async () => {
    const response = await fetch(githubUrl + 'app/src/main/res/xml/changelog.xml')
    const text = await response.text()
    if (text.includes("404: Not Found")) {
        state.value += -900
        return
    }
    //读取xml中resources下的所有item的text
    for (let i = 1; i < text.split("<item text=\"").length; i++) {
        let item = text.split("<item text=\"")[i].split("\"")[0]
        if (item != "") {
            change_log.value.push(item)
        }
    }
    const timeout = setTimeout(() => {
        state.value++
        clearTimeout(timeout)
    }, 300);
}

const getNewIconsAndAll = async () => {
    new_icons.value = icons.newIcons
    icons_count.value = icons.allIcons.length
    state.value++
}

const appTextFormat = (text) => {
    //tracker_network转为Tracker Network,可能没有_，所以要判断,首字母大写
    if (text.includes("_")) {
        return text.split("_").map((item) => {
            return item.charAt(0).toUpperCase() + item.slice(1)
        }).join(" ")
    } else {
        return text.charAt(0).toUpperCase() + text.slice(1)
    }
}
//mounted生命周期
onMounted(() => {
    getVerson()
    getChangeLog()
    getNewIconsAndAll()
})

</script>
<style scoped>
.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
