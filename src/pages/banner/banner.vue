<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <v-list @edit="edit" @init="init" :list="list"></v-list>

    <v-form :info="info" ref="form" @init="init"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vForm from "./components/form";
import { reqbannerList, reqbannerUpdate } from "../../utils/http";
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: "添加轮播图",
      },
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
    // 点击添加
    willAdd() {
      this.info.isshow = true;
      this.info.title = "添加轮播图";
    },
    // 编辑
    edit(id) {
      this.info = {
        isshow: true,
        title: "编辑轮播图",
      };
      this.$refs.form.getOne(id);
    },
    init() {
      reqbannerList().then((res) => {
        console.log(res.data.list)
        this.list = res.data.list;
      });
    },
  },
  mounted() {},
};
</script>
<style>
</style>