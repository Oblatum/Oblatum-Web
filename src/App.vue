<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useNavigationBarStore } from './stores/navigation_bar'

import { setColorScheme } from 'mdui/functions/setColorScheme.js';

setColorScheme('#29aae0')

const router = useRouter()

const navigation_bar = useNavigationBarStore()



const navigation_bar__click = (value: string) => {
  router.push({ name: value })
  navigation_bar.setActive(value)
}

//mounted生命周期
onMounted(() => {
  //routerReady生命周期
  router.isReady().then(() => {
    //获取currentRoute
    const path = router.currentRoute.value.name
    navigation_bar.setActive(path)
  })
})

</script>

<template>
  <mdui-layout>


    <mdui-top-app-bar variant="medium" scroll-behavior="shrink" scroll-threshold="30" scroll-target=".scroll-main">
      <!-- 前置按钮位置 -->
      <!-- 标题 -->
      <mdui-top-app-bar-title class="ml-4">
        {{ navigation_bar.items[navigation_bar.active].name }}
      </mdui-top-app-bar-title>
      <div style="flex-grow: 1"></div>
      <!-- 后置按钮位置 -->
      <mdui-button-icon icon="more_vert--outlined"></mdui-button-icon>
    </mdui-top-app-bar>

    <mdui-navigation-rail :value="navigation_bar.items[navigation_bar.active].to" alignment="end"
      class="bg-[rgba(0,0,0,0)] hidden sm:flex pt-16">
      <mdui-navigation-rail-item v-for="item in navigation_bar.items" :key="item.to" :icon="item.icon+'--outlined'" :active-icon="item.icon" :value="item.to"
        @click="navigation_bar__click(item.to)">
        {{ item.name }}</mdui-navigation-rail-item>
    </mdui-navigation-rail>

    <mdui-navigation-bar :value="navigation_bar.items[navigation_bar.active].to" label-visibility="selected"
      class="md:hidden">
      <mdui-navigation-bar-item v-for="item in navigation_bar.items" :key="item.to" :icon="item.icon+'--outlined'" :active-icon="item.icon" :value="item.to"
        @click="navigation_bar__click(item.to)">
        {{ item.name }}
      </mdui-navigation-bar-item>
    </mdui-navigation-bar>

    <mdui-layout-main class="scroll-main overflow-auto h-screen">
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
</style>
