<template>
  <div>
    <el-dialog
      :title="info.title"
      :visible.sync="info.isshow"
      @closed="closed"
      @opened="opened"
    >
      <el-form :model="user">
        <el-form-item label="活动名称" label-width="120px">
          <el-input
            v-model="user.title"
            placeholder="请输入活动名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="活动期限" label-width="120px">
          <div class="block">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="value"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeChange"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="一级分类" label-width="120px">
          <el-select
            placeholder="请选择一级分类"
            v-model="user.first_cateid"
            @change="changeFirst"
          >
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="120px">
          <el-select placeholder="请选择二级分类" v-model="user.second_cateid"            @change="changeSpecssId">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
   
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" label-width="120px">
          <el-select placeholder="请选择商品" v-model="user.goodsid">
            <el-option
              v-for="item in attrsList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch
            v-model="user.status"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title == '添加活动'"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import path from "path";
import E from "wangeditor";
import { mapGetters, mapActions } from "vuex";
import {
  reqcateList,
  reqseckList,
  reqseckAdd,
  reqseckDetail,
  reqseckUpdate,
  reqgoodsList
  
} from "../../../utils/http";
import { successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      //二级分类
      secondCateList: [],
      // 规格属性list
      attrsList: [],
      value: [],
    };
  },
  computed: {
    ...mapGetters({
      // 一级分类在活动分类的名称里，存在于状态层，拿到一级分类list
      cateList: "cate/list",
      // 从状态层中将规格取出来
      specsList: "specs/list",
      // 商品名称从状态层中取出来
      goodsList:"goods/list"
    }),
  },
  methods: {
    ...mapActions({
      // 拿到一级分类列表后，请求一级分类list
      reqCateList: "cate/reqList",
      // 请求规格的列表数据
      reqSpecsList: "specs/reqList",
      // 活动列表
      reqseckList: "seck/reqList",
      // 请求商品名称
      reqGoodsList:"goods/reqList"
    }),
    // 根据一级分类的id，得到二级分类的list
    changeFirst() {
      // 二级分类的id重置
      this.user.second_cateid = "";
      this.getSecondList();
    },

    getSecondList() {
      // 获取二级分类的list
      reqcateList({ pid: this.user.first_cateid }).then((res) => {
        this.secondCateList = res.data.list;
      });
    },

    // 修改规格，计算出规格属性的list
    changeSpecssId() {
      // 先将specsattr置空
      this.user.goodsid = '';
      this.getAattrs();
    },
    getAattrs() {
       reqgoodsList({ fid: this.user.first_cateid,sid:this.user.second_cateid }).then((res) => {
        this.attrsList = res.data.list;
      });
    },

    cancel() {
      this.info.isshow = false;
    },
    // 清空
    empty() {
      this.user = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      //二级分类
      this.secondCateList = [];
      // 规格属性list
      this.attrsList = [];
      this.value=[]
    },
    // 添加
    add() {
      this.timeChange()
      // 拷贝
      let d = { ...this.user };
      // JSON.stringify 将 JavaScript 值转换为 JSON 字符串
      d.specsattr = JSON.stringify(d.specsattr);

      reqseckAdd(d).then((res) => {
        if (res.data.code === 200) {
          successAlert("添加成功!");
          this.cancel();
          this.empty();
          // 刷新list
          this.reqseckList();
        }
      });
    },
    // 详情
    getOne(id) {
      reqseckDetail(id).then((res) => {
        this.user = res.data.list;
        // 补id
        this.user.id = id;
        // 请二级list
        this.getSecondList();
        // 计算规格属性的list
        this.getAattrs();
        this.value.push(new Date(JSON.parse(this.user.begintime)),new Date(JSON.parse(this.user.endtime)))
      });
    },
    //弹框打开，并且动画结束了
    opened() {
      this.editor = new E("#edit");
      this.editor.create();
    },
    // 更新
    update() {
      // 拷贝
      let d = { ...this.user };
      // JSON.stringify 将 JavaScript 值转换为 JSON 字符串
      d.specsattr = JSON.stringify(d.specsattr);
      reqseckUpdate(d).then((res) => {
        if (res.data.code == 200) {
          successAlert("更新成功");
          this.cancel();
          this.empty();
          // 请二级
          this.reqseckList();
        }
      });
    },
    closed() {
      if (this.info.title == "编辑活动") {
        this.empty();
      }
    },
    // 设置时间
    timeChange() {
      this.user.begintime = this.value[0].getTime();
      console.log(this.user.begintime);
      this.user.endtime = this.value[1].getTime();
      console.log(this.user.endtime);
    },
  },
  mounted() {
    // 一进来先请求一级分类的列表
    this.reqCateList();
    // 一进来请求商品列表
    this.reqGoodsList();

    this.reqseckList();
  },
};
</script>
<style scoped>
</style>