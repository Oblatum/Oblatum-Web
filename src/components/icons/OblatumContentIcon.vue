<template>
    <div class="flex flex-col items-center">
        <img class="size-16 md:size-24 mx-auto"  alt="" :src="imgurl"/>
        <p v-if="textShow" class="text-center text-xs md:text-sm">{{ appTextFormat(icon()) }}</p>
    </div>
</template>
<script setup>

import { useGithubStore } from '@/stores/github';
import { computed } from 'vue';
import { $ } from 'mdui/jq.js';
const githubUrl = useGithubStore().getGithubUrl

//接收父组件传来的icon属性(动态可变)

const props = defineProps({
    iconUrl: String,
    textShow: {
        type: Boolean,
        default: true
    }
})
let imgurl = computed(()=>{
    return githubUrl + 'app/src/main/' + props.iconUrl + '.png'
})
const icon = ()=>{
    return props.iconUrl.split("/").pop()
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

let error_count = 0

$( "img" ).on( "error", function() {
    if(error_count>5){
        return
    }else if(error_count == 5){
        console.log("图片加载失败次数过多，已停止加载")
        return
    }
    error_count++
    let newSrc = imgurl
    $(this).attr("src", newSrc)
})
</script>