<template>
    <Pie
      ref="my-chart"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
    <div class="chartTitle">
        <div>
            <b-dropdown size="sm" dropup id="dropdown-1" v-model="selected" text="Toggle Data Range">
                <b-dropdown-item size="sm" @click="updateChartData('All Time')">All Time</b-dropdown-item>
                <b-dropdown-item size="sm" @click="updateChartData('Last 31 Days')">Last 31 Days</b-dropdown-item>
                <b-dropdown-item size="sm" @click="updateChartData('Last 7 Days')">Last 7 Days</b-dropdown-item>
            </b-dropdown>
        </div>
        <div class="export"><b-button size="sm" variant="primary" @click="exportChart">Export as Image</b-button></div>
    </div>
  </template>
  
  <script>

import { Pie } from 'vue-chartjs'
import 'chart.js/auto'
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getUserBeliefsData } from '@/services/api.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels)

export default {
  name: 'PieChart',
  components: { Pie },
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
            color: '#000000',
            offset: 0,
            font: {
              size: 12,
              weight: 'bold'
            },
            formatter: function (value, context) {
              return value;
            }
          },
        },
        responsive: true,
        maintainAspectRatio: false,
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
        const dateRange = this.selected.replace(/\s/g, '');
        link.download = 'BaseFeelingsSubmissions' + dateRange + '_' + date + '.png';
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
      const sectionColours = [
        'rgba(255, 99, 132, 0.5)', 
        'rgba(54, 162, 235, 0.5)', 
        'rgba(255, 206, 86, 0.5)', 
        'rgba(75, 192, 192, 0.5)', 
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(255, 0, 0, 0.5)',
        'rgba(0, 255, 0, 0.5)',
        'rgba(0, 0, 255, 0.5)',
        'rgba(128, 128, 0, 0.5)',
        'rgba(0, 128, 128, 0.5)',
        'rgba(128, 0, 128, 0.5)',
        'rgba(255, 99, 132, 0.8)', 
        'rgba(54, 162, 235, 0.8)', 
        'rgba(255, 206, 86, 0.8)', 
        'rgba(75, 192, 192, 0.8)', 
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(255, 0, 0, 0.8)',
        'rgba(0, 255, 0, 0.8)'
      ];   

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
      let chartDataTemp = '';      

      if (range === 'Last 7 Days') {
        this.last7Days.forEach((item) => {
          if (item.emotion in counts) {
            counts[item.emotion]++;
          } else {
            counts[item.emotion] = 1;
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
            backgroundColor: sectionColours.slice(0, Object.keys(sortedLabels).length),
            borderColor: 'rgba(175,175,175,255)',
            borderWidth: 2
          }]
        };
      } else if (range === 'Last 31 Days') {
        this.last31Days.forEach((item) => {
          if (item.emotion in counts) {
            counts[item.emotion]++;
          } else {
            counts[item.emotion] = 1;
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
            backgroundColor: sectionColours.slice(0, Object.keys(sortedLabels).length),
            borderColor: 'rgba(175,175,175,255)',
            borderWidth: 2
          }]
        };
      } else if (range === 'All Time') {
        this.allTime.forEach((item) => {
          if (item.emotion in counts) {
            counts[item.emotion]++;
          } else {
            counts[item.emotion] = 1;
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
            backgroundColor: sectionColours.slice(0, Object.keys(sortedLabels).length),
            borderColor: 'rgba(175,175,175,255)',
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
        padding: 0 1rem;
    }
    .chartTitle {
        display: flex;
        justify-content: space-evenly;
    }
  </style>
  