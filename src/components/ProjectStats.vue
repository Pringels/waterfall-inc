<script>
import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,
  name: "ProjectStats",
  mixins: [mixins.reactiveProp],
  props: ["chartData", "options"],
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
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
