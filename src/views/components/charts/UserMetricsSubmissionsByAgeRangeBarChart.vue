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
            titleName: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                chartData: {
                    labels: [],
                    datasets: [{ label: "Age Range", data: [] }]
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
                link.download = 'TotalSubmissionsByAge_' + date + '.png';
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
                                dob: doc.data().dob,
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
                                    dob: this.usersData[j].dob,
                                };
                                this.submissions.push(row);
                            }
                        }
                    }

                    let counts = {
                        'Under 18': 0,
                        '18-24': 0,
                        '25-34': 0,
                        '35-44': 0,
                        '45-54': 0,
                        '55-64': 0,
                        '65 and over': 0
                    };

                    for (let i = 0; i < this.submissions.length; i++) {
                        var dob = this.submissions[i].dob;
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
                    this.chartOptions.plugins.title.text = `Total Submissions by ${this.titleName} - ${range}`

                })
                .catch(error => {
                    console.error('Error getting documents:', error);
                });

            }
        },
        mounted() {
            this.updateChartData(this.selected);
        }
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