<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children' }" 
    >
      <el-table-column prop="title" label="活动名称"></el-table-column>
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
import { reqseckDel } from "../../../utils/http";
import { successAlert } from "../../../utils/alert";
export default {
  computed: {
    ...mapGetters({
      list: "seck/list",
  
    }),
  },
  methods: {
    ...mapActions({
      reqList: "seck/reqList",
     
    }),
    // 删除
    del(id) {
      reqseckDel(id).then((res) => {
        if (res.data.code == 200) {
          successAlert("删除成功");
          this.reqList();
        }
      });
    },
    // 编辑
    edit(id) {
      this.$emit("edit", id);
    },
  },
  mounted() {
    this.reqList();
  },
};
</script>
<style scoped>
img{
  width: 80px;
  height: 80px;
}
</style> 