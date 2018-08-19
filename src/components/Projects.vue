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
            <h3>Bugs {{ projectBugs(project.id) }}</h3>
            <h3>Time left: {{ project.time }}</h3>
            <ProjectStats :chartData="{
              labels: Array(100).fill().map((_, i) => i),
              datasets: [
                {
                  label: 'Bugs',
                  backgroundColor: '#ff5555',
                  data: bugs,
                  pointRadius: 0
                },
                {
                  label: 'Tasks',
                  backgroundColor: '#42b983',
                  data: timeSeries,
                  pointRadius: 0
                }
              ]
            }"/>
        </div>
        </div>    
  </div>
</template>

<script>
import ProjectStats from "../components/ProjectStats";

export default {
  name: "Projects",
  data: () => ({
    timeSeriesData: {
      timeRemaining: [],
      bugs: []
    }
  }),
  methods: {
    splitIntoTasks(id) {
      this.$store.dispatch("splitIntoTasks", id);
    },
    start(id) {
      this.$store.dispatch("startProject", id);
    },
    tasksRemaining(id) {
      const length = this.$store.getters.inCompleteTasksByProjectId(id).length;
      //const length = project.tasks.length;
      return length;
    },
    projectBugs(id) {
      const bugs = this.$store.getters
        .inCompleteTasksByProjectId(id)
        .reduce((acc, curr) => acc + curr.bugs, 0);
      return bugs;
    }
  },
  computed: {
    pendingProjects() {
      return this.$store.getters.pendingProjects;
    },
    activeProjects() {
      return this.$store.getters.activeProjects;
    },
    timeSeries() {
      if (
        this.timeSeriesData.timeRemaining.length !==
        100 - this.activeProjects.b.time
      ) {
        this.timeSeriesData.timeRemaining.push(this.tasksRemaining("b"));
        return [...this.timeSeriesData.timeRemaining];
      }
      return this.timeSeriesData.timeRemaining;
    },
    bugs() {
      if (
        this.timeSeriesData.bugs.length !==
        100 - this.activeProjects.b.time
      ) {
        this.timeSeriesData.bugs.push(this.projectBugs("b"));
        return [...this.timeSeriesData.bugs];
      }
      return this.timeSeriesData.bugs;
    }
  },
  components: { ProjectStats }
};
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
