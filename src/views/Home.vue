<template>
  <div class="home">
    <Company/>
    <Clock/>
    <Projects/>
    <hr/>
    <Resources/>
    <hr/>
    <Tasks/>
  </div>
</template>

<script>
// @ is an alias to /src
import Resources from '@/components/Resources.vue'
import Tasks from '@/components/Tasks.vue'
import Clock from '@/components/Clock.vue'
import Projects from '@/components/Projects.vue'
import Company from '@/components/Company.vue'

export default {
  name: 'home',
  components: {
    Company,
    Projects,
    Clock,
    Resources,
    Tasks
  }
}
</script>
