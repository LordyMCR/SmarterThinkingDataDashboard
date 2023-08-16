<template>
    <Line 
    ref="my-chart"
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData" 
    />
    <div class="chartTitle">
      <div>
          <b-dropdown dropup id="dropdown-1" v-model="selected" text="Toggle Data Range">
              <b-dropdown-item @click="updateChartData('Last 31 Days')">Last 31 Days</b-dropdown-item>
              <b-dropdown-item @click="updateChartData('Last 7 Days')">Last 7 Days</b-dropdown-item>
          </b-dropdown>
      </div>
      <div class="export"><b-button variant="primary" @click="exportChart">Export as Image</b-button></div>
    </div>
  </template>
  
<script>
import { Line } from 'vue-chartjs'
import 'chart.js/auto'
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale } from 'chart.js'
import { getBeliefsData } from '@/services/api.js'

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale)

export default {
  name: 'LineChart',
  components: { Line },
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
        datasets: [{ label: this.labelName, data: [] }]
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
          x: {
            ticks: {
              maxRotation: 90,
              minRotation: 90
            }
          },
          y: {
            ticks: {
              stepSize: 1
            },
            min: 0,
          }
        }
      },
      selected: 'Last 31 Days',
      last7Days: [],
      last31Days: []
    }
  },
  methods: {
      exportChart() {
          const canvas = this.$refs['my-chart'].$el;
          const dataURL = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          const date = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }).replace(/[/:]/g, '-')
          const dateRange = this.selected.replace(/ /g, '');
          link.download = 'BeliefSubmissions_' + dateRange + '_' + date + '.png';
          link.href = dataURL;
          link.click();
      },
      async updateChartData(range) {

        this.last7Days = [];
        this.last31Days = [];
        const dates = [];
        this.selected = range;

        const data = await getBeliefsData();

        data.forEach((item) => {
          if(range === 'Last 7 Days') {
            const today = new Date();
            const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
            const lastWeekTimestamp = lastWeek.toISOString();
            if (item.timestamp > lastWeekTimestamp) {
              this.last7Days.push(item);
            }
          } else if(range === 'Last 31 Days') {
            const today = new Date();
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
            const lastMonthTimestamp = lastMonth.toISOString();
            if (item.timestamp > lastMonthTimestamp) {
              this.last31Days.push(item);
            }
          }
        });   

        let counts = {};
        let chartDataTemp = '';

        if (range === 'Last 7 Days') {
          const today = new Date();
          const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);

          for (let date = lastWeek; date <= today; date.setDate(date.getDate() + 1)) {
            dates.push(date.toLocaleDateString("en-GB", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }));
          }
          this.last7Days.forEach((item) => {
            const submissionDate = item.timestamp;
            const lastDate = new Date(submissionDate);
            const formattedDate = lastDate.toLocaleDateString("en-GB", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            if (formattedDate in counts) {
              counts[formattedDate]++;
            } else {
              counts[formattedDate] = 1;
            }
          });
          chartDataTemp = {
            labels: dates,
            datasets: [
              {
                label: this.labelName,
                data: dates.map(date => counts[date] || 0),
                borderColor: "#4caf50",
                backgroundColor: "#4caf50",
                fill: false
              }
            ]
          };
        } else if (range === 'Last 31 Days') {
          const today = new Date();
          const lastMonth = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
          for (let date = lastMonth; date <= today; date.setDate(date.getDate() + 1)) {
            dates.push(date.toLocaleDateString("en-GB", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }));
          }
          this.last31Days.forEach((item) => {
            const submissionDate = item.timestamp;
            const lastDate = new Date(submissionDate);
            const formattedDate = lastDate.toLocaleDateString("en-GB", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            if (formattedDate in counts) {
              counts[formattedDate]++;
            } else {
              counts[formattedDate] = 1;
            }
          });
          chartDataTemp = {
              labels: dates,
              datasets: [
                {
                  label: this.labelName,
                  data: dates.map(date => counts[date] || 0),
                  borderColor: "#4caf50",
                  backgroundColor: "#4caf50",
                  fill: false
                }
              ]
            };
        }
        
        this.chartData = chartDataTemp;
        this.chartOptions.plugins.title.text = `${this.labelName} - ${range}`
      }
    },
    mounted() {
      this.updateChartData(this.selected)
    },
}

</script>
  
<style scoped>
  #my-chart-id {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 2rem;
  }
  .chartTitle {
      display: flex;
      justify-content: space-evenly;
  }
</style>