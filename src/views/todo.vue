<template>
  <div class="todo">
    <h1>今日待完成</h1>
    <div class="todo_list">
      <div class="todo_item" v-for="(item, index) in list" :key="index">
        <span class="todo_list_name">{{item.name}}</span>
        <span class="todo_list_time">{{item.date}}</span>
        <p>
          <el-link type="primary" @click="finished(index)">完成</el-link>
          <el-link type="primary" @click="del(index)">删除</el-link>
        </p>
      </div>
      <button @click="clear">清空所有待完成任务</button>
    </div>
  </div>
</template>

<script>
import { setTaskTime, restartList } from '../utils/useIPC.js'

export default {
  name: 'todo',
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.getList();
    this.restartList(this.restart)
  },
  methods: {
    getList() {
      this.list = this.$store.state.todoArray;
    },
    finished(index) {
      let res = this.list.splice(index,1);
      res[0]['isFinished'] = true;

      // 修改已完成数据
      this.$store.commit('SET_FINISHED_ARRAY',[
        ...this.$store.state.finishedArray,
        res[0]
      ]);

      // 修改待完成数据
      this.$store.commit('SET_TODO_ARRAY',this.list);

      this.$router.push({
        path: '/finished'
      })
    },
    // 删除
    del(index) {
      this.list.splice(index,1);

      // 修改待完成数据
      this.$store.commit('SET_TODO_ARRAY',this.list);
    },
    // 清空数据
    clear() {
      this.$store.commit('SET_TODO_ARRAY', []);
      this.list = []
    },
    // 启动应用时读取待办任务
    restart() {
      let now = new Date();
      let time = now.getHours()*60 + +now.getMinutes();

      let res = this.list.filter((item) => {
        return this.conversionTime(time,item['date']) < 0
      });
      console.log('过滤掉已经超时的任务',res)
      res.forEach(val => {
        setTaskTime(val['date'],val['name']); // 设置任务时间加入队列
      })
    },
    // 转化时间
    conversionTime(time,val) {
      let date;
      date = val.slice(0,2)*60 + +val.slice(3);
      return time - date;
    },
    restartList,
  },
}
</script>
<style lang="less" scoped>
.todo {
  .todo_list {
    line-height: 30px;
    .todo_item {
      display: flex;
      align-items: center;
      font-size: 16px;
      .todo_list_name {
        flex: 1;
      }
      .todo_list_time {
        flex: 70px;
      }
      &>p{
        flex: 40px;
        &>a{
          font-size: 16px;
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
