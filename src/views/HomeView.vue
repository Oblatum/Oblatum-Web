<script setup>
import { ref, onMounted } from 'vue';

const themes = ref([
  {
    name: 'OPPO',
    value: 'tab-oppo',
  },
  {
    name: '小米',
    value: 'tab-mi',
  },
  {
    name: '更多',
    value: 'tab-more',
  },
]);
let activeThemeTab = ref(0);

const changeActiveThemeTab = () => {
  //每6秒后切换到下一个
  setInterval(() => {
    activeThemeTab.value = (activeThemeTab.value + 1) % themes.value.length;
  }, 6000);
};


import { useIconsStore } from '../stores/icons';
import OblatumContentIcon from '@/components/icons/OblatumContentIcon.vue';

const icons = useIconsStore();
let iconsShow = ref([])
let weatherIcons = ref([])
const getIconsShow = () => {
  //如果icons.allIcons为空，返回空数组
  if (icons.allIcons.length == 0) {
    return []
  }
  let arr = []
  for (let i = 0; i < 12; i++) {
    arr.push(icons.allIcons[Math.floor(Math.random() * icons.allIcons.length)])
  }
  return arr
}

const getWeatherIcons = () => {
  let arr = ["weather_34", "weather_12", "weather_19", "weather_1", "weather_37", "weather_44"]
  return arr
}

onMounted(() => {
  changeActiveThemeTab();
  setTimeout(() => {
    iconsShow.value = getIconsShow();
    weatherIcons.value = getWeatherIcons();
  }, 1000);
});



</script>

<template>
  <div class="mt-36 mb-4 mx-2 poster grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="md:col-span-3">
      <h1 class="text-[rgba(var(--oblatum-color-primary))]">经典的</h1>
      <h1>不规则质感设计</h1>
      <p>基于Material Design，淡化了原有的质感，视感更加的和谐。</p>
    </div>
    <div
      class="grid grid-cols-4 lg:grid-cols-6 gap-6 p-4 md:col-span-3 bg-gradient-to-rb from-[rgba(41,170,224,0.3)] to-[rgba(138,103,184,0.6)] rounded-4 shadow-sm cursor-pointer"
      @click="()=>{iconsShow = getIconsShow()}">
      <OblatumContentIcon v-for="icon in iconsShow" :key="icon" :iconUrl="'res/drawable-nodpi/' + icon"
        :textShow="false" />
    </div>
    <div class="block md:hidden">
      <h1>天气图标扩展</h1>
      <p>支持几何天气图标扩展和Chronus图标包。</p>
    </div>
    <div class="md:col-span-2 grid grid-cols-3 gap-6 my-4 md:mt-24">
      <OblatumContentIcon v-for="icon in weatherIcons" :key="icon" :iconUrl="'res/drawable-xxxhdpi-v4/' + icon"
        :textShow="false" />
    </div>
    <div class="hidden md:flex flex-col justify-end">
      <h1>天气图标扩展</h1>
      <p>支持几何天气图标扩展和Chronus图标包。</p>
    </div>
    <div class="md:col-span-3 md:mt-24">
      <h1>主题</h1>
    </div>
    <mdui-card class="flex flex-col  md:col-span-3">
      <mdui-tabs :value="themes[activeThemeTab].value" placement="bottom-start" class="[&>mdui-tab-panel]:m-4 mt-16"
        variant="secondary">
        <mdui-tab v-for="(theme, index) in themes" @click="activeThemeTab = index" :key="theme.value"
          :value="theme.value">{{ theme.name }}</mdui-tab>

        <mdui-tab-panel slot="panel" value="tab-oppo">
          <p>OPPO主题</p>
        </mdui-tab-panel>
        <mdui-tab-panel slot="panel" value="tab-mi">
          <p>小米主题</p>
        </mdui-tab-panel>
        <mdui-tab-panel slot="panel" value="tab-more">
          <p>主题合作联系</p>
        </mdui-tab-panel>
      </mdui-tabs>
    </mdui-card>
  </div>
</template>
