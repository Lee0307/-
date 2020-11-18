<template>
  <div>
    <el-dialog
      :title="info.title"
      :visible.sync="info.isshow"
      @closed="closed"
      @opened="opened"
    >
      <el-form :model="user">
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
        <el-form-item label="商品名称" label-width="120px">
          <el-input
            v-model="user.goodsname"
            placeholder="请输入商品名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="120px">
          <el-input v-model="user.price" placeholder="请输入价格"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" label-width="120px">
          <el-input
            v-model="user.market_price"
            placeholder="请输入市场价格"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px">
          <!-- 上传文件 -->
          <div class="myupload">
            <h3>+</h3>
            <img v-if="imgUrl" :src="imgUrl" alt="" />
            <input
              v-if="info.isshow"
              type="file"
              class="ipt"
              @change="changeFile"
            />
          </div>
        </el-form-item>
        <el-form-item label="商品规格" label-width="120px">
          <el-select
            placeholder="请选择商品规格"
            v-model="user.specsid"
            @change="changeSpecssId"
          >
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性" label-width="120px">
          <el-select
            placeholder="请选择规格属性"
            v-model="user.specsattr"
            multiple
          >
            <el-option
              v-for="item in attrsList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品" label-width="120px">
          <el-radio v-model="user.isnew" :label="1">是</el-radio>
          <el-radio v-model="user.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖" label-width="120px">
          <el-radio v-model="user.ishot" :label="1">是</el-radio>
          <el-radio v-model="user.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态" label-width="120px">
          <el-switch
            v-model="user.status"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="描述" label-width="120px">
          <!-- 富文本操作 -->
          <div v-if="info.isshow" id="edit"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title == '添加商品'"
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
  reqgoodsAdd,
  reqgoodsDetail,
  reqgoodsUpdate,
} from "../../../utils/http";
import { successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要"[]"
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      //二级分类
      secondCateList: [],
      // 图片地址
      imgUrl: "",
      // 规格属性list
      attrsList: [],
    };
  },
  computed: {
    ...mapGetters({
      // 一级分类在商品分类的名称里，存在于状态层，拿到一级分类list
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
      // 商品列表
      reqgoodsList: "goods/reqList",
      reqgoodsCount: "goods/reqCount",
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

    // 处理图片
    changeFile(e) {
      let file = e.target.files[0];
      // 验证
      // 判断文件大小 1M=1024KB 1KB=1024B
      if (file.size > 2 * 1024 * 1024) {
        errorAlert("文件大小不能超过2M");
        return;
      }

      // 判断文件类型
      let extname = path.extname(file.name);
      console.log(extname);
      let arr = [".jpg", ".jpeg", ".png", ".gif"];
      if (!arr.includes(extname)) {
        errorAlert("请上传正确的图片格式!");
        return;
      }
      this.imgUrl = URL.createObjectURL(file);
      this.user.img = file;
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
    // 新增商品属性
    addAttr() {
      this.attrArr.push({
        value: "",
      });
    },
    // 删除商品属性
    delAttr(index) {
      this.attrArr.splice(index, 1);
    },
    // 清空
    empty() {
      this.user = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要"[]"
        isnew: 1,
        ishot: 1,
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
      // 将编辑器的内容取出来给user.description
      // this.editor.txt.html(); 取值
      this.user.description = this.editor.txt.html();

      // 拷贝
      let d = { ...this.user };
      // JSON.stringify 将 JavaScript 值转换为 JSON 字符串
      d.specsattr = JSON.stringify(d.specsattr);

      reqgoodsAdd(d).then((res) => {
        if (res.data.code === 200) {
          successAlert("添加成功!");
          this.cancel();
          this.empty();
          // 刷新list
          this.reqgoodsList();
          this.reqgoodsCount();
        }
      });
    },
    // 详情
    getOne(id) {
      reqgoodsDetail(id).then((res) => {
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
        //给编辑器赋值
        if (this.editor) {
          this.editor.txt.html(this.user.description);
        }
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
      reqgoodsUpdate(d).then((res) => {
        if (res.data.code == 200) {
          successAlert("更新成功");
          this.cancel();
          this.empty();
          // 请二级
          this.reqgoodsList();
        }
      });
    },
    closed() {
      if (this.info.title == "编辑商品") {
        this.empty();
      }
    },
  },
  mounted() {
    // 一进来先请求一级分类的列表
    this.reqCateList();
    // 请求规格的列表 想要请求所有的规格传递参数true,
    this.reqSpecsList(true);
  },
};
</script>
<style scoped>
.line {
  display: flex;
}
.line .el-input {
  flex: 1;
}
.line .el-button {
  width: auto;
}
.myupload {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  border: 1px dashed #ccc;
  position: relative;
}
.myupload h3 {
  width: 100%;
  height: 100px;
  font-size: 30px;
  text-align: center;
  line-height: 100px;
  color: #666;
  font-weight: 100;
}
.myupload .ipt {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
.myupload img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>