<template>
  <div class="home">
    <Resources/>
    <hr/>
    <Tasks/>
  </div>
</template>

<script>
// @ is an alias to /src
import Resources from "@/components/Resources.vue";
import Tasks from "@/components/Tasks.vue";

export default {
  name: "home",
  components: {
    Resources,
    Tasks
  }
};
</script>
