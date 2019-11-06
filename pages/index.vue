<template>
  <div class="warp">
    <div class="user-name">头号玩家：{{ userName }}</div>
    <div class="add-box">
      <div class="add-line">
        <label class="add-name">地图：</label>
        <select v-model="mapUse" class="map-select" @change="resetNest">
          <option v-for="(m, index) in map.map" :key="index" :value="m">
            {{ m.name }}
          </option>
        </select>
      </div>
      <div class="add-line">
        <label class="add-name">巢穴：</label>
        <select v-model="sendNest" class="map-select">
          <option v-for="(n, index) in mapUse.nest" :key="index" :value="n">
            {{ n }}
          </option>
        </select>
      </div>
      <div class="add-btn" @click="postInfo">
        告诉我让我侃侃到底应该先刷哪些！
      </div>
    </div>
    <div class="flash-data" @click="getList">更新同步数据</div>
    <div
      v-if="nest.length > 0"
      v-loading="loadingNest"
      element-loading-text="给个菊花你侃侃"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="show-repeat-box"
    >
      <h1>巢穴统计：</h1>
      <ol v-if="nest.length > 0">
        <li v-for="(n, index) in nest" :key="index">
          <div>
            巢穴：<span class="red">{{ n.nest }}</span
            >，数量：<span class="red">{{ n.num }}</span>
          </div>
          <div>地图：{{ n.map }}</div>
          <div>傻叼：{{ n.user.join('，') }}</div>
        </li>
      </ol>
    </div>
    <div
      v-if="users.length > 0"
      v-loading="loadingUser"
      element-loading-text="给个菊花你侃侃"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="show-repeat-box"
    >
      <h1>傻叼统计：</h1>
      <ol v-if="nest.length > 0">
        <li v-for="(u, index) in users" :key="index">
          <div>傻叼：{{ u.user }}</div>
          <div
            v-for="(k, _index) in u.sub"
            :key="_index"
            class="user-commission-list"
          >
            {{ _index + 1 }}.{{ k.map + ' ===> ' + k.nest }}
            <span
              v-if="u.user === userName"
              class="delete-btn red"
              @click="deleteInfo(k.id)"
              >打完</span
            >
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import map from '@/assets/map.json'
export default {
  data() {
    return {
      map,
      userName: ``,
      user: ``,
      mapUse: map.map[0],
      sendMap: map.map[0].name,
      sendNest: map.map[0].nest[0],
      nest: [],
      users: [],
      loadingNest: false,
      loadingUser: false
    }
  },
  mounted() {
    if (this.$route.query.who) {
      this.user = parseInt(this.$route.query.who)
      map.user.forEach((u) => {
        if (u.id === this.user) {
          this.userName = u.name
          this.user = u.name
        }
      })
    } else {
      this.user = `路人甲乙丙丁`
      this.userName = `路人甲乙丙丁`
    }
    this.getList()
    // this.deleteInfo()
  },
  methods: {
    resetNest() {
      this.sendMap = this.mapUse.name
      this.sendNest = this.mapUse.nest[0]
    },
    getList() {
      this.getUser()
      this.getNest()
    },
    getUser() {
      this.loadingUser = true
      this.$axios
        .get(`/api/user`)
        .then((res) => {
          console.log(res.data.data)
          this.loadingUser = false
          this.users = res.data.data
        })
        .catch((err) => {
          this.loadingUser = false
          console.log(err)
        })
    },
    getNest() {
      this.loadingNest = true
      this.$axios
        .get(`/api/nest`)
        .then((res) => {
          this.loadingNest = false
          // console.log(res.data.data)
          this.nest = res.data.data
        })
        .catch((err) => {
          this.loadingNest = false
          console.log(err)
        })
    },
    postInfo() {
      if (this.sendNest === `请选择巢穴` || this.sendMap === `请选择地图`) {
        alert(`脑瘫？你没选对！傻叼..`)
        return
      }
      this.$axios
        .post(`/api`, {
          map: this.sendMap,
          nest: this.sendNest,
          user: this.user,
          commission: ``
        })
        .then((res) => {
          // console.log(res)
          alert(res.data.message)
          this.mapUse = map.map[0]
          this.resetNest()
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    deleteInfo(id) {
      this.$axios
        .delete(`/api${id ? '/' + id : ''}`)
        .then((res) => {
          console.log(res.data.message)
          alert(res.data.message)
          this.getList()
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.red {
  color: red;
}
.warp {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
  padding: 30px 10px;
}
.add-line {
  margin: 20px 0;
}
.add-line select {
  min-width: 200px;
}
.add-btn {
  width: max-content;
  padding: 10px 20px;
  font-size: 16px;
  background: white;
  border: 1px solid #000;
  border-radius: 10px;
  margin: 0 auto;
}
.flash-data {
  margin: 10px 0;
  color: dodgerblue;
}
.show-repeat-box {
  margin: 10px 0 0;
}
.show-repeat-box h1 {
  font-size: 20px;
  font-weight: 400;
}
.show-repeat-box li {
  margin: 10px 0;
  padding: 0 0 10px;
  border-bottom: 1px dotted #000;
}
.user-commission-list {
  padding-left: 30px;
}
</style>
