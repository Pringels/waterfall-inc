<template>
  <div class="hello">
    <h1>Resources</h1>
    <div v-for="resource in resources" :key="resource.id">
      {{ resource.name }} - {{ resource.activeTask ? 'Working...' : 'Idle' }} - Familair: {{ resource.familiarity }}
      <select v-model="resource.project" @input="(e) => assign(e.target.value, resource)">
        <option value="null">None</option>
        <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
      </select>
    </div>
    <select v-model="role">
      <option value="fed">FED</option>
      <option value="bed">BED</option>
      <option value="qa">QA</option>
       <option value="arch">ARCH</option>
    </select>
    <input type="number" min="0.1" max="1" step="0.1" v-model="skill"/>
    <button @click="addResource">Add Resource</button>
  </div>
</template>

<script>
import uuidv4 from "uuid/v4";

export default {
  name: "Resources",
  data: () => ({
    role: "",
    skill: 0.5
  }),
  methods: {
    allocate(resource) {
      this.$store.dispatch("allocateTask", resource);
    },
    addResource() {
      this.$store.dispatch("addResource", {
        id: uuidv4(),
        activeTask: null,
        role: this.role,
        skill: this.skill,
        familiarity: 0,
        name: "NOOB " + this.role + " - " + this.skill,
        cost: 1000 * this.skill
      });
    },
    assign(projectId, resource) {
      this.$store.dispatch("assignToProject", { resource, projectId });
    }
  },
  computed: {
    resources() {
      return this.$store.getters.resources;
    },
    projects() {
      return this.$store.getters.activeProjects;
    },
    tasks() {}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
