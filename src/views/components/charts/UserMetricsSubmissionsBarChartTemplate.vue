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
    import firebase from "firebase/compat/app";
    import "firebase/compat/auth";
    import "firebase/compat/firestore";

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
                usersData: [],
                beliefsData: [],
                submissions: [],
                selected: 'All Time',
            };
        },
        methods: {
            exportChart() {
                const canvas = this.$refs['my-chart'].$el;
                const dataURL = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                const date = new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' }).replace(/[/:]/g, '-')
                link.download = 'TotalSubmissionsBy' + this.labelName + '_' + date + '.png';
                link.href = dataURL;
                link.click();
            },
            updateChartData(range) {
                this.usersData = [];
                this.beliefsData = [];
                this.submissions = [];

                const db = firebase.firestore();

                const usersRef = db.collection('users');
                usersRef.get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            const userData = {
                                userID: doc.data().userID,
                                [this.xAxisMetric]: doc.data()[this.xAxisMetric],
                            };
                            this.usersData.push(userData);
                        });
                    })
                    .catch(error => {
                        console.error('Error getting documents:', error);
                    });

                    let beliefsRef = '';
                    if (range === 'Last 31 Days') {
                        const lastMonth = new Date();
                        lastMonth.setMonth(lastMonth.getMonth() - 1);
                        const lastMonthTimestamp = lastMonth.toISOString();
                        beliefsRef = db.collection('beliefs').where('timestamp', '>', lastMonthTimestamp)
                    } else if (range === 'Last 7 Days') {
                        const lastWeek = new Date();
                        lastWeek.setDate(lastWeek.getDate() - 7);
                        const lastWeekTimestamp = lastWeek.toISOString();
                        beliefsRef = db.collection('beliefs').where('timestamp', '>', lastWeekTimestamp)
                    } else {
                        beliefsRef = db.collection('beliefs');
                    }
                    
                    beliefsRef.get()
                        .then(snapshot => {
                            snapshot.forEach(doc => {
                                const beliefData = {
                                    userID: doc.data().userID,
                                };
                                this.beliefsData.push(beliefData);
                            });
                        
                    for (let i = 0; i < this.beliefsData.length; i++) {
                        for (let j = 0; j < this.usersData.length; j++) {
                            if (this.beliefsData[i].userID === this.usersData[j].userID) {
                                const row = {
                                    userID: this.usersData[j].userID,
                                    [this.xAxisMetric]: this.usersData[j][this.xAxisMetric],
                                };
                                this.submissions.push(row);
                            }
                        }
                    }

                    let counts = {};

                    for (let i = 0; i < this.submissions.length; i++) {
                        var label = this.submissions[i][this.xAxisMetric];
                        if (label in counts) {
                            counts[label]++;
                        } else {
                            counts[label] = 1;
                        }
                    }

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
                    this.chartOptions.plugins.title.text = `Total Submissions by ${this.labelName} - ${range}`


                })
                .catch(error => {
                    console.error('Error getting documents:', error);
                });  

            },
        },
        mounted() {
            this.updateChartData(this.selected);
        },
    };

</script>

<style scoped>
    #my-chart-id {
        margin-bottom: 1rem;
        padding: 1rem;
    }
    .chartTitle {
        display: flex;
        justify-content: space-evenly;
    }
</style>