<template>
  <div class="clock">
   <ul>
      <li v-for="(value, key) in timeInfo" :key="key">
        {{key}}: {{value}}
      </li>
   </ul>
   <button @click="start">Start day</button>
   <input type="range" v-model.number="speed" @input="toggleSpeed" min="1" max="10"/>
   <input type="checkbox" v-model="auto" @input="toggleAuto"/>
   <button v-if="timeInfo.paused" @click="togglePause(false)">Resume</button>
   <button v-else @click="togglePause(true)">Pause</button>
  </div>
</template>

<script>
export default {
  name: "Clock",
  data() {
    return {
      speed: this.$store.getters.timeInfo.speed,
      auto: this.$store.getters.timeInfo.autoStartDay
    };
  },
  methods: {
    start() {
      this.$store.dispatch("startDay");
    },
    toggleSpeed() {
      this.$store.dispatch("setSpeed", this.speed);
    },
    toggleAuto(event) {
      this.$store.dispatch("setAuto", event.target.checked);
    },
    togglePause(pause) {
      this.$store.dispatch("setPause", pause);
    }
  },
  computed: {
    timeInfo() {
      return this.$store.getters.timeInfo;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.clock {
  width: 50%;
  display: inline-block;
}
</style>
