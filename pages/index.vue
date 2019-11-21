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
        <label class="add-name">要刷的：</label>
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
    <div class="flash-data" @click="getList">
      更新同步数据
      <span v-if="parseInt($route.query.who) === 1" @click="deleteInfo()"
        >delete</span
      >
    </div>
    <div
      v-if="nest.length > 0"
      v-loading="loadingMap"
      element-loading-text="给个菊花你侃侃"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="show-repeat-box"
    >
      <h1>沙雕统计：</h1>
      <ol v-if="maps.length > 0">
        <li v-for="(n, index) in maps" :key="index">
          <div>地图：{{ n.map }}</div>
          <ul v-for="(m, _index) in n.sub" :key="_index">
            <div>本：{{ m.name }}， x{{ m.num }}</div>
          </ul>
        </li>
      </ol>
    </div>
    <!--    <div-->
    <!--      v-if="nest.length > 0"-->
    <!--      v-loading="loadingNest"-->
    <!--      element-loading-text="给个菊花你侃侃"-->
    <!--      element-loading-spinner="el-icon-loading"-->
    <!--      element-loading-background="rgba(0, 0, 0, 0.8)"-->
    <!--      class="show-repeat-box"-->
    <!--    >-->
    <!--      <h1>沙雕统计：</h1>-->
    <!--      <ol v-if="nest.length > 0">-->
    <!--        <li v-for="(n, index) in nest" :key="index">-->
    <!--          <div>-->
    <!--            沙雕：<span class="red">{{ n.nest }}</span-->
    <!--            >，数量：<span class="red">{{ n.num }}</span>-->
    <!--          </div>-->
    <!--          <div>地图：{{ n.map }}</div>-->
    <!--          <div>傻叼：{{ n.user.join('，') }}</div>-->
    <!--        </li>-->
    <!--      </ol>-->
    <!--    </div>-->
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
        <div v-for="(u, index) in users" :key="index">
          <li v-if="userName === u.user">
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
        </div>
      </ol>
      <div v-else>还没的统计</div>
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
      uid: ``,
      mapUse: map.map[0],
      sendMap: map.map[0].name,
      sendNest: map.map[0].nest[0],
      nest: [],
      users: [],
      maps: [],
      loadingMap: false,
      loadingNest: false,
      loadingUser: false
    }
  },
  mounted() {
    this.uid = parseInt(this.$route.query.who)
    if (this.$route.query.who) {
      map.user.forEach((u) => {
        if (u.id === this.uid) {
          this.userName = u.name
          this.user = u.name
        }
      })
    } else {
      this.user = `路人甲乙丙`
      this.userName = `路人甲乙丙`
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
      this.getMap()
    },
    getUser() {
      this.loadingUser = true
      this.$axios
        .get(`/api/user`)
        .then((res) => {
          // console.log(res.data.data)
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
          console.log(res.data.data)
          this.nest = res.data.data
        })
        .catch((err) => {
          this.loadingNest = false
          console.log(err)
        })
    },
    getMap() {
      this.loadingMap = true
      this.$axios
        .get(`/api/map`)
        .then((res) => {
          this.loadingMap = false
          console.log(res.data.data)
          this.maps = res.data.data
        })
        .catch((err) => {
          this.loadingMap = false
          console.log(err)
        })
    },
    postInfo() {
      if (this.sendNest === `请选择沙雕`) {
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
