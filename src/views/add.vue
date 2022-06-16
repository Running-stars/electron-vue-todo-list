<template>
  <div class="add">
    <h1>新建任务</h1>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="设置名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="设置时间" prop="date">
        <el-time-picker placeholder="选择时间" v-model="ruleForm.date" format="HH:mm" style="width: 100%;"></el-time-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >立即创建</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { setTaskTime } from '../utils/useIPC.js'
export default {
  name: 'add',
  data() {
    return {
      ruleForm: {
        name: '',
        date: '',
        isFinished: false,
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
        ],
        date: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 新增任务并存储
          this.ruleForm['date'] = this.conversionTime(this.ruleForm['date']);
          let list = this.$store.state.todoArray;
          this.$store.commit('SET_TODO_ARRAY',[
            ...list,
            this.ruleForm
          ]);

          setTaskTime(this.ruleForm['date'],this.ruleForm['name']); // 设置任务时间加入队列

          this.$router.push({
            path: '/'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 转化时间
    conversionTime(time) {
      let h = new Date(time).getHours();
      let m = new Date(time).getMinutes();
      let t = h.toString().padStart(2,0) + ':' + m.toString().padStart(2,0);
      return t
    }
  },
}
</script>
