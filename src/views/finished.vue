<template>
  <div class="finished">
    <h1>今日已完成</h1>
    <div class="finished_list">
      <div class="finished_item" v-for="(item, index) in list" :key="index">
        <span class="finished_list_name">{{item.name}}</span>
        <span class="finished_list_time">{{item.date}}</span>
        <p>
          <i class="el-icon-s-flag"></i>
        </p>
      </div>
    </div>
    <button @click="clear">清空所有已完成任务</button>
  </div>
</template>

<script>

export default {
  name: 'finished',
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.getList();
  },
  
  methods: {
    getList() {
      this.list = this.$store.state.finishedArray;
    },
    clear() {
      this.$store.commit('SET_FINISHED_ARRAY', []);
      this.list = []
    }
  },
}
</script>
<style lang="less" scoped>
.finished {
  .finished_list {
    line-height: 30px;
    .finished_item {
      display: flex;
      align-items: center;
      font-size: 16px;
      .finished_list_name {
        flex: 1;
      }
      .finished_list_time {
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
