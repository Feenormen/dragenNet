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
        <select v-model="nestUse" class="map-select">
          <option v-for="(n, index) in mapUse.nest" :key="index" :value="n">
            {{ n.name }}
          </option>
        </select>
      </div>
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
      user: null,
      sendMap: null,
      sendNest: null,
      mapUse: { name: ``, nest: [] },
      nestUse: { name: `` }
    }
  },
  mounted() {
    this.user = parseInt(this.$route.query.who)
    map.user.forEach((u) => {
      if (u.id === this.user) {
        this.userName = u.name
      }
    })
    this.mapUse = map.map[0]
    this.nestUse = map.map[0].nest[0]
  },
  methods: {
    resetNest() {
      this.sendMap = this.mapUse.id
      this.sendNest = null
      this.nestUse = this.mapUse.nest[0]
    }
  }
}
</script>

<style scoped>
.warp {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  position: relative;
  padding: 30px 10px;
}
</style>
