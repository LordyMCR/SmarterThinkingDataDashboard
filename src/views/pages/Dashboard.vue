<template>
  <div class="some-page-wrapper">
    <div class="row">
      <div class="column">
        <div class="green-column">
          <div class="boxes">
            <b>Belief Submissions Total - Last 31 Days</b>
            <i><DashboardMetricBox metric="total" /></i>
          </div>
          <div class="boxes">
            <b>Most Selected Base Feeling(s) - Last 31 Days</b>
            <i><DashboardMetricBox metric="baseFeeling" /></i>
          </div>
          <div class="boxes">
            <b>Most Selected Emotion(s) - Last 31 Days</b>
            <i><DashboardMetricBox metric="emotion" /></i>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="column">
        <div class="white-column">
          <DashboardBeliefSubLineChart labelName="Belief Submissions"/>
        </div>
      </div>
      <div class="column">
        <div class="orange-column">
          <DashboardFeelingsBarChart labelName="Base Feelings"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardMetricBox from "../components/DashboardMetricBox.vue";
import DashboardFeelingsBarChart from "../components/charts/DashboardFeelingsBarChart.vue";
import DashboardBeliefSubLineChart from "../components/charts/DashboardBeliefSubLineChart.vue";

export default {
  components: {
    DashboardMetricBox,
    DashboardFeelingsBarChart,
    DashboardBeliefSubLineChart,
  },
};

</script>
    
<style scoped>

.some-page-wrapper {
    width: 100%;
}
.row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
}
.column {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
}

.white-column {
    height: 75vh;
    width: 99%;
    margin-left: 2%;
    padding-bottom: 75px;
    text-align: center;
    font-weight: bold;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
}
.orange-column {
    height: 75vh;
    width: 99%;
    padding-bottom: 75px;
    margin-left: -2%;
    text-align: center;
    font-weight: bold;
    border-left: 1px solid black;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
}

.green-column {
    height: 12.5vh;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 20px;
}
.boxes {
    background-color: rgb(175, 175, 175);
    height: 90%;
    width: 30%;
    max-width: 35vh;
    flex-direction: column;
    border-radius: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3vh;
    padding: 20px;
    text-align: center;
    border: 1px solid black;
}

b {
    font-size: 1.3vh;
}

</style>


