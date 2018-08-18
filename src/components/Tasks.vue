<template>
  <div class="hello">
      <h1>Tasks</h1>
      <div v-for="task in tasks" :key="task.id">
        {{ task.name }} - {{ task.status }}
      </div>
      <button @click="create">Create</button>
  </div>
</template>

<script>
export default {
	name: 'Tasks',
	methods: {
		create() {
			this.$store.dispatch('addTask');
		}
	},
	computed: {
		tasks() {
			return this.$store.getters.tasks;
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
	margin: 40px 0 0;
}
</style>
