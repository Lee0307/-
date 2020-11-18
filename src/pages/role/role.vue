<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <v-list :list="list" @init="init" @edit="edit"></v-list>

    <v-form :info="info" @init="init" ref="form"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vForm from "./components/form";
import { reqRoleList } from "../../utils/http";
export default {
  data() {
    return {
      // 初始值 弹框数值
      info: {
        isshow: false,
        title: "添加角色",
      },
      // 列表数据初始值
      list: [],
    };
  },
  components: {
    vList,
    vForm,
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    willAdd() {
      this.info = {
        isshow: true,
        title: "添加角色",
      };
    },
    // 发请求
    init() {
      reqRoleList().then((res) => {
        let list = res.data.list ? res.data.list : [];
        this.list = list;
      });
    },
    // 编辑
    edit(id) {
      this.info = {
        isshow: true,
        title: "编辑角色",
      };
      this.$refs.form.getOne(id);
    },
  },
  mounted() {
    // 一进来，发请求
    this.init();
  },
};
</script>
<style>
</style>