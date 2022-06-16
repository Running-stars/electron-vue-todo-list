<template>
  <div class="MainView">
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-vertical-demo"
          :router="true"
          @select="handleOpen">
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">代办事项</span>
          </el-menu-item>
          <el-menu-item index="/finished">
            <i class="el-icon-document"></i>
            <span slot="title">已完成</span>
          </el-menu-item>
          <el-menu-item index="/add">
            <i class="el-icon-setting"></i>
            <span slot="title">新建</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <i class="el-icon-close" @click="closeMain"></i>
        <h1>{{dateTime}}</h1>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { closeMain } from "../../utils/useIPC.js"
export default {
  name: 'MainView',
  data() {
    return {
      dateTime: '',
    };
  },
  mounted() {
    this.getDateTime();
  },
  computed: {
    activeIndex() {
      // 手动路由跳转时菜单高亮
      return this.$route.path;
    },
  
  },
  methods: {
    // 点击菜单时跳转
    handleOpen(key) {
      this.$router.push({
        path: key
      })
    },
    // 获取当天日期
    getDateTime() {
      let date = new Date();
      this.dateTime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    },
    closeMain,
  },
}
</script>
<style lang="less" scoped>
.MainView {
  height: 100%;
  .el-container{
    height: 100%;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    .el-icon-close{
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
    .el-icon-close:hover {
      background-color: red;
    }
  }
}
</style>
