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
            <span class="demonstration">默认</span>
            <el-date-picker
              v-model="value1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
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
          <el-select placeholder="请选择二级分类" v-model="user.second_cateid">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动" label-width="120px">
          <el-select placeholder="请选择活动" v-model="user.second_cateid">
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
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
  reqseckAdd,
  reqseckDetail,
  reqseckUpdate,
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
      value1: "",
    };
  },
  computed: {
    ...mapGetters({
      // 一级分类在活动分类的名称里，存在于状态层，拿到一级分类list
      cateList: "cate/list",
      // 从状态层中将规格取出来
      specsList: "specs/list",
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
      this.user.specsattr = [];
      this.getAattrs();
    },
    getAattrs() {
      // 取出 specsid, 哪条数据的id和this.user.specsid是一样的
      let obj = this.specsList.find((item) => item.id === this.user.specsid);
      console.log(obj);
      //就将这条数据的attrs取出来，赋值给attrsList
      this.attrsList = obj.attrs;
      console.log(this.attrsList);
    },

    cancel() {
      this.info.isshow = false;
    },
    // 新增活动属性
    addAttr() {
      this.attrArr.push({
        value: "",
      });
    },
    // 删除活动属性
    delAttr(index) {
      this.attrArr.splice(index, 1);
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
      // 图片地址
      this.imgUrl = "";
      // 规格属性list
      this.attrsList = [];
    },
    // 添加
    add() {
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
        // 处理图片
        this.imgUrl = this.$imgPre + this.user.img;
        // 属性
        this.user.specsattr = JSON.parse(this.user.specsattr);
        // 计算规格属性的list
        this.getAattrs();
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
  },
  mounted() {
    // 一进来先请求一级分类的列表
    this.reqCateList();
  },
};
</script>
<style scoped>
</style>