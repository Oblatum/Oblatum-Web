<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useNavigationBarStore } from './stores/navigation_bar'

import { setColorScheme } from 'mdui/functions/setColorScheme.js';

import { useGithubStore } from '@/stores/github';
import { useIconsStore } from './stores/icons';
const githubUrl = useGithubStore().getGithubUrl

setColorScheme('#29aae0')

const router = useRouter()

const navigation_bar = useNavigationBarStore()
const icons = useIconsStore()



const navigation_bar__click = (value: string) => {
  document.querySelector('.scroll-main')?.scrollTo({ top: 0, behavior: 'smooth' })
  router.push({ name: value })
  navigation_bar.setActive(value)
}

const getNewIconsAndAll = async () => {
    const response = await fetch(githubUrl + 'app/src/main/res/xml/drawable.xml')
    const text = await response.text()
    let new_icons = ref<string[]>([])
    let icons_all = ref<string[]>([])

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
    let all = []
    for (let i = 1; i < getIcons.length; i++) {
        let icon = getIcons[i].split("\"")[0]
        if (icon != "") {
            all.push(icon)
        }
    }
    icons_all.value = all
    icons.newIcons =  new_icons.value
    icons.allIcons = icons_all.value

}

//mounted生命周期
onMounted(() => {
  //routerReady生命周期
  router.isReady().then(() => {
    //获取currentRoute
    const path = router.currentRoute.value.name || ''
    navigation_bar.setActive(path)
  })
  getNewIconsAndAll()
})

</script>

<template>
  <mdui-layout>


    <mdui-top-app-bar variant="medium" scroll-behavior="shrink" scroll-threshold="30" scroll-target=".scroll-main">
      <!-- 前置按钮位置 -->
      <!-- 标题 -->
      <mdui-top-app-bar-title class="ml-4">
        {{ navigation_bar.items[navigation_bar.active].name }}
      <span slot="label-large">{{ navigation_bar.items[navigation_bar.active].title }}</span>
    </mdui-top-app-bar-title>
      <div style="flex-grow: 1"></div>
      <!-- 后置按钮位置 -->
      <mdui-button-icon icon="more_vert--outlined"></mdui-button-icon>
    </mdui-top-app-bar>

    <mdui-navigation-rail :value="navigation_bar.items[navigation_bar.active].to" alignment="end"
      class="bg-[rgba(0,0,0,0)] hidden md:flex pt-16">
      <mdui-navigation-rail-item v-for="item in navigation_bar.items" :key="item.to" :icon="item.icon+'--outlined'" :active-icon="item.icon" :value="item.to"
        @click="navigation_bar__click(item.to)">
        {{ item.name }}</mdui-navigation-rail-item>
    </mdui-navigation-rail>

    <mdui-navigation-bar :value="navigation_bar.items[navigation_bar.active].to" label-visibility="selected"
      class="flex md:hidden">
      <mdui-navigation-bar-item v-for="item in navigation_bar.items" :key="item.to" :icon="item.icon+'--outlined'" :active-icon="item.icon" :value="item.to"
        @click="navigation_bar__click(item.to)">
        {{ item.name }}
      </mdui-navigation-bar-item>
    </mdui-navigation-bar>

    <mdui-layout-main class="scroll-main overflow-auto h-[100dvh]">
      <div class="px-4 md:px-16 lg:mx-auto lg:max-w-[980px]">
        <RouterView class="z-100 relative"></RouterView>
        <div class="py-8 px-4 flex flex-col items-center justify-center opacity-65 [&>*]:m-0 z-10">
          <p class="text-sm scale-75">Copyright © 2024 Oblatum Org. 保留所有权利。</p>
          <p class="text-sm scale-75"><a class="no-underline hover:underline cursor-pointer">蜀ICP备 备案号预留位</a></p>

        </div>
      </div>

    </mdui-layout-main>
  </mdui-layout>

</template>

<style>
.poster *{
  line-height: 1.8;
}
.poster h1,h2,h3,h4,h5,h6{
  letter-spacing: 0.05em;
  margin: 0;
}
.poster p,a,span{
  letter-spacing: 0.1em;
  margin: 0;
}
.poster p{
  opacity: 0.65;
}
mdui-card > h3{
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}
</style>
