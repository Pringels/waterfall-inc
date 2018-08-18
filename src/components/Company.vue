<template>
  <div class="company">
    <h1>Company</h1>
    <p>$ {{ funds }}</p>
  </div>
</template>

<script>
export default {
  name: "Company",
  computed: {
    funds() {
      return this.$store.getters.funds;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.company {
  width: 50%;
  display: inline-block;
}
</style>
