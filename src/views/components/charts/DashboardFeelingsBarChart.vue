<template>
    <Bar
      ref="my-chart"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
    <div class="chartTitle">
        <div>
            <b-dropdown dropup id="dropdown-1" v-model="selected" text="Toggle Data Range">
                <b-dropdown-item @click="updateChartData('All Time')">All Time</b-dropdown-item>
                <b-dropdown-item @click="updateChartData('Last 31 Days')">Last 31 Days</b-dropdown-item>
                <b-dropdown-item @click="updateChartData('Last 7 Days')">Last 7 Days</b-dropdown-item>
            </b-dropdown>
        </div>
        <div class="export"><b-button variant="primary" @click="exportChart">Export as Image</b-button></div>
    </div>
  </template>
  
  <script>

import { Bar } from 'vue-chartjs'
import 'chart.js/auto'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { getBeliefsData } from '@/services/api.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    labelName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chartData: {
        labels: [],
        datasets: [{ label: "Base Feelings", data: [] }]
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
            ticks: {
              stepSize: 1
            }
          }
        }
      },
      selected: 'Last 31 Days',
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
        const dateRange = this.selected.replace(/\s/g, '');
        link.download = 'BaseFeelingsSubmissions' + dateRange + '_' + date + '.png';
        link.href = dataURL;
        link.click();
    },
    async updateChartData(range) {

      this.last7Days = [];
      this.last31Days = [];
      this.allTime = [];
      this.chartData = {};
      this.selected = range;

      const data = await getBeliefsData();

      data.forEach((item) => {
        if(range === 'Last 7 Days') {
          const lastWeek = new Date();
          lastWeek.setDate(lastWeek.getDate() - 7);
          const lastWeekTimestamp = lastWeek.toISOString();
          if (item.timestamp > lastWeekTimestamp) {
            this.last7Days.push(item);
          }
        } else if(range === 'Last 31 Days') {
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          const lastMonthTimestamp = lastMonth.toISOString();
          if (item.timestamp > lastMonthTimestamp) {
            this.last31Days.push(item);
          }
        } else if (range === 'All Time') {
            this.allTime.push(item);
        }
      });   
      
      let counts = {};
      let chartDataTemp = '';      

      if (range === 'Last 7 Days') {
        this.last7Days.forEach((item) => {
          if (item.baseFeeling in counts) {
            counts[item.baseFeeling]++;
          } else {
            counts[item.baseFeeling] = 1;
          }
        });
        const sortedLabels = Object.keys(counts)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .reduce((acc, key) => {
              acc[key] = counts[key];
              return acc;
            }, {});
        chartDataTemp = {
          labels: Object.keys(sortedLabels),
          datasets: [{
            label: 'Base Feelings',
            data: Object.values(sortedLabels),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
          }]
        };
      } else if (range === 'Last 31 Days') {
        this.last31Days.forEach((item) => {
          if (item.baseFeeling in counts) {
            counts[item.baseFeeling]++;
          } else {
            counts[item.baseFeeling] = 1;
          }
        });
        const sortedLabels = Object.keys(counts)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .reduce((acc, key) => {
              acc[key] = counts[key];
              return acc;
            }, {});
        chartDataTemp = {
          labels: Object.keys(sortedLabels),
          datasets: [{
            label: 'Base Feelings',
            data: Object.values(sortedLabels),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
          }]
        };
      } else if (range === 'All Time') {
        this.allTime.forEach((item) => {
          if (item.baseFeeling in counts) {
            counts[item.baseFeeling]++;
          } else {
            counts[item.baseFeeling] = 1;
          }
        });
        const sortedLabels = Object.keys(counts)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .reduce((acc, key) => {
              acc[key] = counts[key];
              return acc;
            }, {});
        chartDataTemp = {
          labels: Object.keys(sortedLabels),
          datasets: [{
            label: 'Base Feelings',
            data: Object.values(sortedLabels),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
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
        margin-top: 1rem;
        margin-bottom: 1.5rem;
        padding: 2rem;
    }
    .chartTitle {
        display: flex;
        justify-content: space-evenly;
    }
  </style>
  