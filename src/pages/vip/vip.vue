<template>
  <div>
    <v-list :list="list" @edit="edit"></v-list>
    <!-- 由于添加完成，会多数据，所以不仅要刷新list,还要重新请求总数 -->
    <v-form :info="info" ref="form" @init="init"></v-form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vList from "./components/list";
import vForm from "./components/form";
import { reqmemberList } from "../../utils/http";
export default {
  data() {
    return {
      info: {
        isshow: false,
        title: "添加会员",
      },
      //列表数据初始值
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
    //获取列表数据 发请求
    init() {
      // 获取列表数据
      reqmemberList().then((res) => {
        this.list = res.data.list;
      });
    },
    // 编辑
    edit(uid) {
      this.info = {
        isshow: true,
        title: "编辑会员",
      };
      this.$refs.form.getOne(uid);
     
    },
  },
  mounted() {
    //一进来就发送请求
    this.init();
  },
};
</script>
<style>
</style>