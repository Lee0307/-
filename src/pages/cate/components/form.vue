<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isshow" @closed="closed">
      <el-form :model="user">
        <el-form-item label="上级分类" label-width="120px">
          <el-select v-model="user.pid" placeholder="请选择">
            <el-option :value="0" label="顶级分类"></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :value="item.id"
              :label="item.catename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" label-width="120px">
          <el-input v-model="user.catename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px" v-if="user.pid !== 0">
          <!-- 原生js上传图片 -->
          <!-- 如果添加成功，此时，input上的文件应该清楚掉，所以直接将input节点清除 -->
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
        <el-button type="primary" @click="add" v-if="info.title == '添加分类'"
          >添 加</el-button
        >
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import path from "path";
import { mapGetters, mapActions } from "vuex";
import { successAlert, errorAlert } from "../../../utils/alert";
import {
  reqRoleList,
  reqcateAdd,
  reqcateDetail,
  reqcateUpdate,
} from "../../../utils/http";
export default {
  props: ["info"],
  data() {
    return {
      user: {
        pid: "",
        catename: "",
        img: null,
        status: 1,
      },
      imgUrl: "",
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "cate/reqList",
    }),
    // 选择文件
    changeFile(e) {
      let file = e.target.files[0];
      console.log(file);

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

      // URL.createObjectURL(file)将一个文件生成一个url地址
      this.imgUrl = URL.createObjectURL(file);

      // 给user.img赋值
      this.user.img = file;
    },
    // 点击取消
    cancel() {
      this.info.isshow = false;
    },
    // 清空
    empty() {
      this.user = {
        pid: "",
        catename: "",
        img: null,
        status: 1,
      };
      this.imgUrl = "";
    },
    // 点击添加
    add() {
      reqcateAdd(this.user).then((res) => {
        if (res.data.code === 200) {
          //弹成功
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //清空数据
          this.empty();
          //数据列表刷新
          this.reqList();
        }
      });
    },
    // 获取详情
    getOne(id) {
      reqcateDetail(id).then((res) => {
        // 此刻user没有id
        this.user = res.data.list;

        this.imgUrl = this.$imgPre + this.user.img;

        // 补id
        this.user.id = id;
      });
    },
    // 点击修改
    update() {
      reqcateUpdate(this.user).then((res) => {
        if (res.data.code == 200) {
          // 弹成功
          successAlert("修改成功");
          // 弹框消失
          this.cancel();
          // 清空数据
          this.empty();
          // 刷新list
          this.reqList();
        }
      });
    },
    // 清空数据
    closed() {
      if (this.info.title === "编辑分类") {
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
<style scoped>
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