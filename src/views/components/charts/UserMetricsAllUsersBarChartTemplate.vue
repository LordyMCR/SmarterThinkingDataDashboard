<template>
    <Bar
      ref="my-chart"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
    <div class="chartTitle">
      <div class="export"><b-button variant="primary" @click="exportChart">Export as Image</b-button></div>
    </div>
  </template>
  
  <script>
    import { Bar } from 'vue-chartjs'
    import 'chart.js/auto'
    import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
    import { getUsersData } from '@/services/api.js';
  
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
    export default {
      name: 'BarChart',
      components: { Bar },
      props: {
        xAxisMetric: {
          type: String,
          required: true
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
            datasets: [{ label: this.labelName, data: [] }]
          },
          chartOptions: {
            plugins: {
              title: {
                display: true,
                text: `All Users by ${this.labelName}`,
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
            },
            backgroundColor: 'white'
          },
        };
      },
      async mounted() {
        this.updateChartData();
      },
      methods: {
        exportChart() {
            const canvas = this.$refs['my-chart'].$el;
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            const date = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }).replace(/[/:]/g, '-')
            link.download = 'AllUsersBy' + this.labelName + '_' + date + '.png';
            link.href = dataURL;
            link.click();
        },
        async updateChartData() {

          const usersData = await getUsersData();

          let counts = {};

          for (let i = 0; i < usersData.length; i++) {
            var users = usersData[i];
            var metricValue = users[this.xAxisMetric];
            if (metricValue in counts) {
              counts[metricValue]++;
            } else {
              counts[metricValue] = 1;
            }
          };

          const sortedLabels = Object.keys(counts)
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            .reduce((acc, key) => {
              acc[key] = counts[key];
              return acc;
            }, {});

          let backgroundColor = '';
          let borderColor = '';
          if (this.labelName === "Country") {
            backgroundColor = 'rgba(255, 99, 132, 0.2)';
            borderColor = 'rgb(255, 99, 132)';
          } else if (this.labelName === "Gender") {
            backgroundColor = 'rgba(75, 192, 192, 0.2)';
            borderColor = 'rgb(75, 192, 192)';
          } else if (this.labelName === "Occupation") {
            backgroundColor = 'rgba(153, 102, 255, 0.2)';
            borderColor = 'rgb(153, 102, 255)';
          }  

          const chartData = {
            labels: Object.keys(sortedLabels),
            datasets: [{
              label: this.labelName,
              data: Object.values(sortedLabels),
              backgroundColor: backgroundColor,
              borderColor: borderColor,
              borderWidth: 2
            }]
          };

          this.chartData = chartData;
          this.chartOptions.plugins.title.text = `All Users by ${this.labelName}`

        }
      }
    }
  </script>
  
  
<style scoped>
   #my-chart-id {
        margin-bottom: 1rem;
        padding: 1rem;
    }
    .chartTitle {
        display: flex;
        justify-content: center;
    }
</style>
  