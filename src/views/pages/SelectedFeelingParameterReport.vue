<template>
  <div class="some-page-wrapper">
    <div class="row1">
      <div class="column">
        <div class="white-column">
          <div class="button-wrapper">
            <b-button class="backBtn" variant="secondary" @click="goBack">Back</b-button>
            <p class="query-text">Base Feeling: {{ query }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row1">
      <div class="column">
        <div class="green-column">
          <div class="boxes">
            <b>Total Submissions</b>
            <i><FeelingParameterReportMetricBox :category="selectionCategory" :parameter="query" metric="emotionCount" /></i>
          </div>
          <div class="boxes">
            <b>Last Submission Date</b>
            <i><FeelingParameterReportMetricBox :category="selectionCategory" :parameter="query" metric="lastDate" /></i>
          </div>
          <div class="boxes">
            <b>Most Selected Emotion(s)</b>
            <i><FeelingParameterReportMetricBox :category="selectionCategory" :parameter="query" metric="mostSelected" /></i>
          </div>
        </div>
      </div>
    </div>
    <div class='row1'>
      <div class='column'>
        <div class='orange-column1'>
          <FeelingParameterReportFeelingsPieChart :category="selectionCategory" :parameter="query" :labelName="`Base Feeling - ${this.query} - Selected Emotions`"/>
        </div>
      </div>
      <div class='column'>
        <div class='blue-column'>
          <FeelingParameterReportIntensityBarChart :category="selectionCategory" :parameter="query" :labelName="`Base Feeling - ${this.query} - Average Emotions Intensity Rating `"/>
        </div>
      </div>
    </div>
    <div class='row1'>
      <div class='column'>
        <div class='orange-column1'>
          <FeelingParameterReportAgreeBarChart :category="selectionCategory" :parameter="query" :labelName="`Base Feeling - ${this.query} - Average New Thinking Agreement Rating`"/>
        </div>
      </div>
      <div class='column'>
        <div class='blue-column'>
          <FeelingParameterReportIntensityAgreeScatterPlot :category="selectionCategory" :parameter="query" :labelName="`Base Feeling - ${this.query} - Emotion Intensity / New Thinking Agreement Relationship `"/>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
  import FeelingParameterReportMetricBox from '../components/FeelingParameterReportMetricBox.vue';
  import FeelingParameterReportFeelingsPieChart from '../components/charts/FeelingParameterReportFeelingsPieChart.vue';
  import FeelingParameterReportIntensityBarChart from '../components/charts/FeelingParameterReportIntensityBarChart.vue';
  import FeelingParameterReportAgreeBarChart from '../components/charts/FeelingParameterReportAgreeBarChart.vue';
  import FeelingParameterReportIntensityAgreeScatterPlot from '../components/charts/FeelingParameterReportIntensityAgreeScatterPlot.vue';

  export default {
    components: { 
      FeelingParameterReportMetricBox,
      FeelingParameterReportFeelingsPieChart,
      FeelingParameterReportIntensityBarChart,
      FeelingParameterReportAgreeBarChart,
      FeelingParameterReportIntensityAgreeScatterPlot,
    },
    props: {
      selectionCategory: {
        type: String,
        required: true
      },
      query: {
        type: String,
        required: true
      },
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
    },
  };
</script>
  
<style scoped>
  .some-page-wrapper {
    width: 100%;
    overflow: hidden !important;
    background: #ededed;

  }
  
  .row1 {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .column {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  .white-column {
    height: 4.3vh;
  }
  
  .button-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .green-column {
    height: 9vh;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .query-text {
    flex-grow: 1;
    text-align: center;
    font-size: 2.5vh;
    font-weight: bold;
    padding-top: 0.3rem;
  }

  .boxes {
      background-color: rgb(175, 175, 175);
      height: 75%;
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

  .orange-column1 {
    height: 37.7vh;
    width: 100%;
    padding-bottom: 40px;
    text-align: center;
    font-weight: bold;
    border-top: 1px solid black;
    border-right: 1px solid black;

  }

  .blue-column {
    height: 37.7vh;
    width: 99%;
    padding-bottom: 40px;
    text-align: center;
    font-weight: bold;
    border-top: 1px solid black;
  }

  .green-column1 {
    height: 37.7vh;
    width: 100%;
    text-align: center;
    font-weight: bold;
    border-top: 1px solid black;
  }

  .orange-column2 {
    height: 37.7vh;
    width: 99%;
    text-align: center;
    font-weight: bold;
    border-left: 1px solid black;
    border-top: 1px solid black;
  }
</style>
  