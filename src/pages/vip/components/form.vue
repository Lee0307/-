<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="user.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="120px">
          <el-input v-model="user.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="120px">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="120px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"
            >>
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="update">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert } from "../../../utils/alert";
import {
  reqRoleList,
  reqmemberDetail,
  reqmemberUpdate,
} from "../../../utils/http";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
      // 角色列表
      roleList: [],
    };
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    // 点击取消
    cancel() {
      this.info.isshow = false;
    },
    // 清空
    empty() {
      this.user = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    // 获取详情
    getOne(uid) {
      reqmemberDetail(uid).then((res) => {
        this.user = res.data.list;
        this.user.password = "";
      });
    },
    // 点击修改
    update() {
      reqmemberUpdate(this.user).then((res) => {
        if (res.data.code == 200) {
          // 弹成功
          successAlert("修改成功");
          // 弹框消失
          this.cancel();
          // 清空数据
          this.empty();
          // 刷新list
          this.$emit("init");
        }
      });
    },
    // 清空数据
    closed() {
      if (this.info.title === "编辑管理员") {
        this.empty();
      }
    },
  },
  mounted() {
    // 一进来先获取菜单列表数据
    reqRoleList().then((res) => {
      if (res.data.code == 200) {
        this.roleList = res.data.list;
      }
    });
  },
};
</script>
<style>
</style>