<script setup>
import { ref,onMounted } from 'vue';

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

onMounted(() => {
  changeActiveThemeTab();
});

</script>

<template>
  <div class="my-4 mx-2">
    <h1>首页建设中...</h1>
    <p>看看下载页吧</p>
    <mdui-card class="flex flex-col">
      <mdui-tabs :value="themes[activeThemeTab].value" placement="bottom-start" class="[&>mdui-tab-panel]:m-4 mt-16" variant="secondary">
        <mdui-tab v-for="(theme,index) in themes" @click="activeThemeTab=index" :key="theme.value" :value="theme.value">{{ theme.name }}</mdui-tab>

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
