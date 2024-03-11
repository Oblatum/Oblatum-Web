<template>
    <div class="flex flex-col gap-4 justify-center items-center">
        <div class="flex gap-8 self-baseline w-full">
            <img class="w-32 h-32 self-end rounded-6 shadow-md hover:shadow-xl transition-all" alt=""
                :src="githubRow + githubUrl + 'app/src/main/ic_launcher-playstore.png'" />
            <div class="grow">
                <p class="opacity-85 text-xl">Oblatum 图标</p>
                <p class="opacity-65 capitalize">{{ version }}</p>
                <mdui-button full-width class="w-full" :href="download_url" target="_blank">
                    <mdui-icon slot="icon" name="downloading"></mdui-icon>
                    下载
                </mdui-button>
            </div>

        </div>

        <mdui-card variant="outlined" class="w-full p-0">
            <mdui-list class="p-0 grid grid-cols-2 opacity-55">
                <mdui-list-item>
                    <div class="flex flex-col items-center">
                        <p class="m-0">{{ download_count }}次</p>
                        <p class="m-0 font-black text-[14px]">下载</p>
                    </div>
                </mdui-list-item>
                <mdui-list-item>
                    <div class="flex flex-col items-center">
                        <p class="m-0">{{ icons_count }}个</p>
                        <p class="m-0 font-black text-[14px]">图标</p>
                    </div>
                </mdui-list-item>
            </mdui-list>
        </mdui-card>

        <mdui-card class="w-full p-4">
            <h3 class="mt-0 opacity-85">更新日志 <span
                    class="text-sm text-end opacity-55 font-normal">{{ update_time }}</span></h3>
            <mdui-divider></mdui-divider>
            <p v-for="(item, index) in change_log" :key="index" class="opacity-75">{{ index + 1 }}、{{ item }}</p>
        </mdui-card>


        <mdui-card class="w-full p-4" v-if="new_icons.length != 0">
            <h3 class="mt-0 opacity-85">图标变动</h3>
            <mdui-divider></mdui-divider>
            <mdui-list class="pt-0 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                <mdui-list-item v-for="(item, index) in new_icons" :key="index">
                    <div class="flex flex-col items-center">
                        <img class="size-16 md:size-24 mx-auto" alt=""
                            :src="githubRow + githubUrl + 'app/src/main/res/drawable-nodpi/' + item + '.png'">
                        <!-- 溢出省略 -->
                        <p class="text-center text-xs md:text-sm overflow-ellipsis">{{ appTextFormat(item) }}</p>
                    </div>
                </mdui-list-item>
            </mdui-list>
        </mdui-card>
        <Transition>
            <div v-if="state < 3"
                class="fixed w-full h-full bg-[rgba(var(--mdui-color-secondary-container-light),0.4)] top-0 left-0 flex flex-col justify-center items-center backdrop-blur-3xl backdrop-brightness-115 dark:backdrop-brightness-10">
                <mdui-circular-progress></mdui-circular-progress>
                <p class="text-xl opacity-60">正在拉取数据...</p>
            </div>
        </Transition>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'

const githubRow = "https://gh.api.99988866.xyz/"
const githubUrl = "https://raw.githubusercontent.com/Oblatum/Oblatum-IconPack-Reborn/master/"
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
    //截取versionName开头，换行符结尾的字符串
    version.value = text[0].tag_name
    update_time.value = new Date(text[0].assets[0].updated_at).toLocaleString()
    download_url.value = text[0].assets[0].browser_download_url
    download_count.value = text[0].assets[0].download_count
    state.value++
}

const getChangeLog = async () => {
    const response = await fetch(githubRow + githubUrl + 'app/src/main/res/xml/changelog.xml')
    const text = await response.text()
    //读取xml中resources下的所有item的text
    for (let i = 1; i < text.split("<item text=\"").length; i++) {
        let item = text.split("<item text=\"")[i].split("\"")[0]
        if (item != "") {
            change_log.value.push(item)
        }
    }
    state.value++
}

const getNewIconsAndAll = async () => {
    const response = await fetch(githubRow + githubUrl + 'app/src/main/res/xml/drawable.xml')
    const text = await response.text()
    //截取<category title="New and Update" />到下一个<category 之间的所有drawable="xxx"的字符串
    let getNew_icons = text.split("<category title=\"New and Update\" />")[1].split("<category ")[0].split("drawable=\"")
    for (let i = 1; i < getNew_icons.length; i++) {
        let icon = getNew_icons[i].split("\"")[0]
        if (icon != "") {
            new_icons.value.push(icon)
        }
    }
    //截取<category title="All" />到下一个<category 之间的所有drawable="xxx"的字符串
    let getIcons = text.split("<category title=\"All\" />")[1].split("<category ")[0].split("drawable=\"")
    let count = 0
    for (let i = 1; i < getIcons.length; i++) {
        let icon = getIcons[i].split("\"")[0]
        if (icon != "") {
            count++
        }
    }
    icons_count.value = count
    const timeout = setTimeout(() => {
        state.value++
        clearTimeout(timeout)
    }, 300);
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
