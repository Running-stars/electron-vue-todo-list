<template>
  <div class="Remindview">
    <span class="close enable-click" @click="closeRemind">知道了</span>
    <div class="reminder">
      <span>{{remindMsg}}</span>的时间到啦！
    </div>
    <div class="background"
        :style="{
          backgroundImage: 'url(./img/' + imgs[bgIndex] + ')',
          backgroundSize:'contain'}">
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron');
import { closeRemind } from "../../utils/useIPC.js"
export default {
  name: 'Remindview',
  data() {
    return {
      remindMsg: 'we',
      bgIndex: parseInt(Math.random() * 4),
      imgs: [
        '1.jpg',
        '2.jpg',
        '3.jpg',
        '4.jpg',
      ]
    };
  },
  created() {
    this.setRemindMsg();
  },
  methods: {
    closeRemind,
    setRemindMsg() {
      ipcRenderer.on('setTask', (e, name) => {
        this.remindMsg = name;
      })
    },
  },
}
</script>
<style lang="less" scoped>
.Remindview{
  text-shadow: 1px 1px 1px black, 0px -1px 1px white;
  .reminder{
    text-align: center;
    margin: 100px auto;
    font-size: 30px;
    width: 280px;
    color:gold;
  }
  .background{
    position: fixed;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;
    filter: blur(3px) opacity(0.5);
  }
  .close{
    position: absolute;
    font-size: 14px;
    color:dodgerblue;
    right: 30px;
    bottom: 30px;
    cursor: pointer;
    z-index: 1;
  }
}
</style>
