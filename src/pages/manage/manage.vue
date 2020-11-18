<template>
  <div>
    <el-button type="primary" @click="willAdd">添加</el-button>

    <v-list :list="list" @init="newInit" @edit="edit"></v-list>
    <!-- 由于添加完成，会多数据，所以不仅要刷新list,还要重新请求总数 -->
    <v-form :info="info" @init="newInit" ref="form"></v-form>

    <!-- 分页
    total：总条数
    page-size:一页的数量
    current-change:当前页码发生了修改，会触发，回调函数的参数就是新的页码
     -->
    <el-pagination
      @current-change="changePage"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
    ></el-pagination>
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
        title: "添加管理员",
      },
      //列表数据初始值
      list: [],
      // 分页符初始化
      total: 0, //总页数
      size: 2, //一页的数量
      page: 1, //页码
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
      this.info.title = "添加管理员";
    },
    //获取列表数据 发请求
    init() {
      // 获取列表数据
      reqUserList({ page: this.page, size: this.size }).then((res) => {
        let list = res.data.list ? res.data.list : [];

        // 如果取到的list是[],并且page>1,page自减,请列表
        if (list.length === 0 && this.page > 1) {
          this.page--;
          this.init();
          return;
        }
 
        this.list = list;
      });
    },
    // 获取总数
    getCount() {
      reqUserCount().then((res) => {
        this.total = res.data.list[0].total;
      });
    },
    // 页码发生修改
    changePage(page) {
      this.page = page;
      this.init();
    },
    // 请list,请总数
    newInit() {
      this.init();
      this.getCount();
    },
    // 编辑
    edit(uid) {
      this.info = {
        isshow: true,
        title: "编辑管理员",
      };
      this.$refs.form.getOne(uid);
    },
  },
  mounted() {
    //一进来就发送请求
    this.init();
    // 请求总数
    this.getCount();
  },
};
</script>
<style>
</style>