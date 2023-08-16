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
          titleName: {
              type: String,
              required: true
          }
        },
        data() {
            return {
                chartData: {
                    labels: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65 and over'],
                    datasets: [{ label: "Age Range", data: [0, 0, 0, 0, 0, 0, 0] }]
                },
                chartOptions: {
                    plugins: {
                        title: {
                            display: true,
                            text: `All Users by ${this.titleName}`,
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
                }
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
                link.download = 'AllUsersBy' + this.titleName + '_' + date + '.png';
                link.href = dataURL;
                link.click();
            },
            async updateChartData() {

                const usersData = await getUsersData();

                let counts = {
                    'Under 18': 0,
                    '18-24': 0,
                    '25-34': 0,
                    '35-44': 0,
                    '45-54': 0,
                    '55-64': 0,
                    '65 and over': 0
                };

                for (let i = 0; i < usersData.length; i++) {
                    var users = usersData[i];
                    var dob = users.dob;
                    var [day, month, year] = dob.split('/');
                    var birthDate = new Date(year, month - 1, day);
                    var ageDiff = Date.now() - birthDate.getTime();
                    var ageDate = new Date(ageDiff);
                    var age = Math.abs(ageDate.getUTCFullYear() - 1970);
                        
                    if (age < 18) {
                        counts['Under 18']++;
                    } else if (age < 25) {
                        counts['18-24']++;
                    } else if (age < 35) {
                        counts['25-34']++;
                    } else if (age < 45) {
                        counts['35-44']++;
                    } else if (age < 55) {
                        counts['45-54']++;
                    } else if (age < 65) {
                        counts['55-64']++;
                    } else {
                        counts['65 and over']++;
                    }
                }

                const chartData = {
                    labels: Object.keys(counts),
                    datasets: [{
                    label: 'Age Range',
                    data: Object.values(counts),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                    }]
                };

                this.chartData = chartData;

            }
        },
        
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
  