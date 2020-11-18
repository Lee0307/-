<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="id" label="编号"> </el-table-column>
      <el-table-column prop="title" label="轮播图标题"></el-table-column>
      <el-table-column label="图片" sortable>
        <template slot-scope="scope">
          <img :src="$imgPre + scope.row.img" alt="" />  
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status === 1"
            >启用</el-button
          >
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <del-btn @confirm="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert } from "../../../utils/alert";
import { reqbannerDel, reqbannerUpdate } from "../../../utils/http";
export default {
  props: ['list'],
  computed: {
    ...mapGetters({
    }),
  },
  methods: {
    ...mapActions({
    }),
    // 删除
    del(id) {
      reqbannerDel(id).then((res) => {
        if (res.data.code == 200) {
          // 成功的弹框
          successAlert(res.data.msg);
          this.$emit("init");
        }
      });
    },
    // 编辑
    edit(id) {
      this.$emit("edit", id);
    },
  },
  mounted() {
    // 一进来发起请求
    this.$emit("init");
  },
};
</script>
<style scoped>
img {
  width: 80px;
  height: 80px;
}
</style>