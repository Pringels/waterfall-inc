<template>
  <div class="hello">
      <h1>Tasks</h1>
      <div class="column">
        <div v-for="task in readyTasks.slice(0, 10)" :key="task.id">
          <p>Name: {{ task.name }}</p>
          <p>Complexity: {{ task.complexity }}</p>
        </div>
      </div>
      <div class="column">  
        <div v-for="task in pendingTasks.slice(0, 10)" :key="task.id">
          <p>Name: {{ task.name }}</p>
           <p>Progress: {{ task.progress }}</p>
        </div>
      </div>
      <div class="column">  
        <div v-for="task in doneTasks.slice(0, 10)" :key="task.id">
          <p>Name: {{ task.name }}</p>
          <p>Bugs: {{ task.bugs }}</p>
          <p>Complexity: {{ task.complexity }}</p>
        </div>
      </div>  
      <button @click="create">Create</button>
  </div>
</template>

<script>
export default {
  name: "Tasks",
  methods: {
    create() {
      this.$store.dispatch("addTask");
    }
  },
  computed: {
    readyTasks() {
      return this.$store.getters.readyTasks;
    },
    pendingTasks() {
      return this.$store.getters.pendingTasks;
    },
    doneTasks() {
      return this.$store.getters.doneTasks;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

.column {
  width: 33%;
  min-height: 200px;
  float: left;
}
</style>
