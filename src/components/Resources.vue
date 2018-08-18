<template>
  <div class="hello">
    <h1>Resources</h1>
      <div v-for="resource in resources" :key="resource.id">
        {{ resource.name }} - {{ resource.activeTask }}
        <button @click="allocate(resource)">Allocate task</button>
      </div>
  </div>
</template>

<script>
export default {
	name: 'Resources',
	methods: {
		allocate(resource) {
			this.$store.dispatch('allocateTask', resource);
		},
		selfAllocate(resource) {
			setTimeout(() => {
				this.$store.dispatch('allocateTask', resource);
				this.selfAllocate(resource);
			}, 500);
		}
	},
	computed: {
		resources() {
			return this.$store.getters.resources;
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
