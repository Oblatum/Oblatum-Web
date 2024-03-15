import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { RouteRecordName } from 'vue-router'

export const useNavigationBarStore = defineStore('navigation_bar', {
  state: () => ({
    items:[
      {
        name: "首页",
        title: "Oblatum 图标",
        icon: "home",
        to: "home"
      },
      {
        name: "下载",
        title: "下载",
        icon: "download",
        to: "download"
      },
      {
        name: "适配",
        title: "适配",
        icon: "markunread_mailbox",
        to: "apply"
      },
      // {
      //   name: "友链",
      //   title: "友链",
      //   icon: "link",
      //   to: "link"
      // }
    ],
    active: 0
  }),
  getters: {
    activeItem: (state) => {
      return state.items[state.active]
    }
  },
  actions: {
    setActive(to: RouteRecordName) {
      const index = this.items.findIndex((item) => item.to === to)
      if (index !== -1) {
        this.active = index
      }
    }
  }
})
