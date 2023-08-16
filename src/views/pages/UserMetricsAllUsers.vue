<template>
  <div class='some-page-wrapper'>
    <div class='row'>
      <div class='column'>
        <div class='orange-column1'>
          <UserMetricsAllUsersBarChartTemplate xAxisMetric="country" labelName="Country" />
        </div>
      </div>
      <div class='column'>
        <div class='blue-column'>
          <UserMetricsAgeRangeBarChart titleName="Age" />
        </div>
      </div>
    </div>
    <div class='row'>
      <div class='column'>
        <div class='green-column'>
          <UserMetricsAllUsersBarChartTemplate xAxisMetric="gender" labelName="Gender"/>
        </div>
      </div>
      <div class='column'>
        <div class='orange-column2'>
          <UserMetricsAllUsersBarChartTemplate xAxisMetric="occupation" labelName="Occupation"/>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
  import UserMetricsAgeRangeBarChart from '../components/charts/UserMetricsAgeRangeBarChart.vue';
  import UserMetricsAllUsersBarChartTemplate from '../components/charts/UserMetricsAllUsersBarChartTemplate.vue';

  export default {
    components: {
      UserMetricsAgeRangeBarChart,
      UserMetricsAllUsersBarChartTemplate
    },
  };
</script>
    
<style scoped>
  .some-page-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex: 1; 
  }
  
  .column {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;
  }
  
  .orange-column1 {
    height: 46vh;
    width: 98%;
    margin-left: 1%;
    padding-bottom: 60px;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
  }
  .blue-column {
    height: 46vh;
    width: 98%;
    padding-bottom: 60px;
    margin-left: -1%;
    text-align: center;
    font-weight: bold;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
  }

  .green-column {
    height: 46vh;
    width: 98%;
    margin-left: 1%;
    padding-bottom: 60px;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
  }
  .orange-column2 {
    height: 46vh;
    width: 98%;
    padding-bottom: 60px;
    margin-left: -1%;
    text-align: center;
    font-weight: bold;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
  }
  
</style>