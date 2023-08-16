<template>
    <Bar
      ref="my-chart"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
    <div class="chartTitle">
        <div>
            <b-dropdown size="sm" dropup id="dropdown-1" v-model="selected" text="Toggle Data Range">
                <b-dropdown-item @click="updateChartData('All Time')">All Time</b-dropdown-item>
                <b-dropdown-item @click="updateChartData('Last 31 Days')">Last 31 Days</b-dropdown-item>
                <b-dropdown-item @click="updateChartData('Last 7 Days')">Last 7 Days</b-dropdown-item>
            </b-dropdown>
        </div>
        <div class="export"><b-button size="sm" variant="primary" @click="exportChart">Export as Image</b-button></div>
    </div>

  </template>
  
  <script>

import { Bar } from 'vue-chartjs'
import 'chart.js/auto'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js'
import { getUserBeliefsData } from '@/services/api.js'

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    category: {
      type: String,
      required: true,
    },
    parameter: {
      type: String,
      required: true,
    },
    labelName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [{ label: "Average Intensity Rating", data: [] }],
      },
      chartOptions: {
        plugins: {
          title: {
            display: true,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          datalabels: {
            labels: {
              title: null
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 100,
          }
        },
      },
      selected: 'All Time',
      last7Days: [],
      last31Days: [],
      allTime: [],

    };
  },
  methods: {
    exportChart() {
        const canvas = this.$refs['my-chart'].$el;
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        const date = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }).replace(/[/:]/g, '-')
        const dateRange = this.selected.replace(/ /g, '');
        link.download = 'EmotionsIntensityAverages_' + dateRange + '_' + date + '.png';
        link.href = dataURL;
        link.click();
    },
    async updateChartData(range) {

      const data = await getUserBeliefsData();

      this.last7Days = [];
      this.last31Days = [];
      this.allTime = [];
      this.chartData = {};
      this.selected = range;

      data.forEach((item) => {
        if(range === 'Last 7 Days') {
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          const lastWeekTimestamp = lastWeek.toISOString();
          if (item.timestamp > lastWeekTimestamp && item.baseFeeling === this.parameter) {
            this.last7Days.push(item);
          }
        } else if(range === 'Last 31 Days') {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          const lastMonthTimestamp = lastMonth.toISOString();
          if (item.timestamp > lastMonthTimestamp && item.baseFeeling === this.parameter) {
            this.last31Days.push(item);
          }
        } else if (range === 'All Time') {
            if (item.baseFeeling === this.parameter) {
            this.allTime.push(item);
          }
        }
      });   

      let counts = {};
      let averageTotals = {};
      let averages = {};
      let chartDataTemp = '';

      if (range === 'All Time') {
        this.allTime.forEach((item) => {
          if (item.emotion in counts) {
            counts[item.emotion]++;
            averageTotals[item.emotion] += item.lv1Intensity;
          } else {
            counts[item.emotion] = 1;
            averageTotals[item.emotion] = item.lv1Intensity;
          }
        });
        for (let key in counts) {
          if (counts.hasOwnProperty(key) && averageTotals.hasOwnProperty(key)) {
            const avg = averageTotals[key] / counts[key];
            averages[key] = Number(avg.toFixed(2));
            if (isNaN(averages[key])) {
              averages[key] = 0;
            }
          }
        }
        const sortedLabels = Object.keys(averages)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .reduce((acc, key) => {
              acc[key] = averages[key];
              return acc;
            }, {});
        chartDataTemp = {
          labels: Object.keys(sortedLabels),
          datasets: [{
            label: 'Average Intensity Rating',
            data: Object.values(sortedLabels),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2
          }]
        };
      } else if (range === 'Last 31 Days') {
        this.last31Days.forEach((item) => {
          if (item.emotion in counts) {
            counts[item.emotion]++;
            averageTotals[item.emotion] += item.lv1Intensity;
          } else {
            counts[item.emotion] = 1;
            averageTotals[item.emotion] = item.lv1Intensity;
          }
        });
        for (let key in counts) {
          if (counts.hasOwnProperty(key) && averageTotals.hasOwnProperty(key)) {
            const avg = averageTotals[key] / counts[key];
            averages[key] = Number(avg.toFixed(2));
            if (isNaN(averages[key])) {
              averages[key] = 0;
            }
          }
        }
        const sortedLabels = Object.keys(averages)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .reduce((acc, key) => {
              acc[key] = averages[key];
              return acc;
            }, {});
        chartDataTemp = {
          labels: Object.keys(sortedLabels),
          datasets: [{
            label: 'Average Intensity Rating',
            data: Object.values(sortedLabels),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2
          }]
        };
      } else {
        this.last7Days.forEach((item) => {
          if (item.emotion in counts) {
            counts[item.emotion]++;
            averageTotals[item.emotion] += item.lv1Intensity;
          } else {
            counts[item.emotion] = 1;
            averageTotals[item.emotion] = item.lv1Intensity;
          }
        });
        for (let key in counts) {
          if (counts.hasOwnProperty(key) && averageTotals.hasOwnProperty(key)) {
            const avg = averageTotals[key] / counts[key];
            averages[key] = Number(avg.toFixed(2));
            if (isNaN(averages[key])) {
              averages[key] = 0;
            }
          }
        }
        const sortedLabels = Object.keys(averages)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .reduce((acc, key) => {
              acc[key] = averages[key];
              return acc;
            }, {});
        chartDataTemp = {
          labels: Object.keys(sortedLabels),
          datasets: [{
            label: 'Average Intensity Rating',
            data: Object.values(sortedLabels),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 2
          }]
        };
      }

      this.chartData = chartDataTemp;
      this.chartOptions.plugins.title.text = `${this.labelName} - ${range}`
    },
  },
  mounted() {
    this.updateChartData(this.selected);
  },  
}

</script>

<style scoped>
    #my-chart-id {
        margin-bottom: 1rem;
        padding: 0 25px 0 25px;
    }
    .chartTitle {
        display: flex;
        justify-content: space-evenly;
    }

</style>
  