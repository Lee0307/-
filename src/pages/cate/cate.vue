<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <v-list @edit="edit"></v-list>
   
    <v-form :info="info" ref="form"></v-form>

  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vForm from "./components/form";
import { reqUserList, reqUserCount } from "../../utils/http";
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: "添加分类",
      }
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
      this.info.title = "添加分类";
    },
    // 编辑
    edit(id) {
      this.info = {
        isshow: true,
        title: "编辑分类",
      };
      this.$refs.form.getOne(id);
    },
  },
  mounted() {
   
  },
};
</script>
<style>
</style>