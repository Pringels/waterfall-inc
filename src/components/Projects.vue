<template>
  <div class="projects">
    <h1>Projects</h1>
    <div class="list">
        <div v-for="project in pendingProjects" :key="project.id">
            <h3>{{ project.name }}</h3>
            <button @click="splitIntoTasks(project.id)">Split</button>
            <button @click="start(project.id)">Start</button>
        </div>
    </div>
    <div class="list">    
        <div v-for="project in activeProjects" :key="project.id">
            <h3>{{ project.name }}</h3>
            <h3>{{ tasksRemaining(project.id) }}</h3>
        </div>
        </div>    
  </div>
</template>

<script>
export default {
  name: 'Projects',
  methods: {
    splitIntoTasks(id) {
      this.$store.dispatch('splitIntoTasks', id)
    },
    start(id) {
      this.$store.dispatch('startProject', id)
    },
    tasksRemaining(id) {
      const length = this.$store.getters.inCompleteTasksByProjectId(id).length
      return length
    }
  },
  computed: {
    pendingProjects() {
      return this.$store.getters.pendingProjects
    },
    activeProjects() {
      return this.$store.getters.activeProjects
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.projects {
  width: 50%;
  display: inline-block;
}
.list {
  display: inline-block;
  width: 50%;
}
</style>
