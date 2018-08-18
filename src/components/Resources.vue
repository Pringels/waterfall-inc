<template>
  <div class="hello">
    <h1>Resources</h1>
    <div v-for="resource in resources" :key="resource.id">
      {{ resource.name }} - {{ resource.activeTask ? 'Working...' : 'Idle' }}
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
import uuidv4 from 'uuid/v4'

export default {
  name: 'Resources',
  data: () => ({
    role: '',
    skill: 0.5
  }),
  methods: {
    allocate(resource) {
      this.$store.dispatch('allocateTask', resource)
    },
    addResource() {
      this.$store.dispatch('addResource', {
        id: uuidv4(),
        activeTask: null,
        role: this.role,
        skill: this.skill,
        name: 'NOOB ' + this.role + ' - ' + this.skill,
        cost: 1000 * this.skill
      })
    }
  },
  computed: {
    resources() {
      return this.$store.getters.resources
    },
    tasks() {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
</style>
