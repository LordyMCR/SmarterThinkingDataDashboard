<template>
  <div class='some-page-wrapper'>
    <div class="row">
      <div class="column">
        <div class="white-column">
          <div class="button-wrapper">
            <b-button variant="secondary" @click="goBack">Back</b-button>
          </div>
        </div>
      </div>
    </div>
    <div class='row'>
      <div class='column'>
        <div class='blue-column'>
          <div class="details">
              <p>refID: <b>{{ $route.params.id }}</b></p>
              <p>Date of Birth: <b>{{ moment(dob).format('DD/MM/YYYY') }}</b></p>
              <p>Age: <b>{{ age }}</b></p>
              <p>Gender: <b>{{ gender }}</b></p>
              <p>Country: <b>{{ country }}</b></p>
              <p>Occupation: <b>{{ occupation }}</b></p>
            </div>
        </div>
      </div>
      <div class='column'>
      <div class='orange-column'>
        <div class="stats">
          <div class="row">
            <div class="column">
              <div class="boxes">
                <b>Last Feeling/Emotion Submitted</b>
                <i>{{ lastFeelingSubmitted }}/{{ lastEmotionSubmitted }}</i>
              </div>
            </div>
            <div class="column">
              <div class="boxes">
                <b>Submissions in Last 31 Days</b>
                <i>{{ monthlySubmissions }}</i>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="column">
              <div class="boxes">
                <b>Last Submission Date</b>
                <i>{{ lastSubmissionDate }}</i>
              </div>
            </div>
            <div class="column">
              <div class="boxes">
                <b>Total Submissions</b>
                <i>{{ totalSubmissions }}</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    <div class='row'>
      <div class='column'>
        <div class='green-column'>
          <DataTable 
              v-if="beliefs.length > 0"
              class="display"
              id="displayID"
              :options="{
                  pageLength: 10,
                  autoWidth: true,
                  order: [[8, 'desc']],
                  dom: 'Bfrtip',
                  buttons: [
                      {
                        extend: 'excelHtml5',
                        text: 'Excel Export',
                        title: this.refID + '_DataExport_' + (new Date()).toLocaleString('en-GB', { timeZone: 'Europe/London' }).replace(/[/:]/g, '-'),
                        className: 'btn btn-outline-success',
                        exportOptions: {
                          columns: ':not(:last-child)',
                        }
                      },
                      {
                        extend: 'csvHtml5',
                        text: 'CSV Export',
                        title: this.refID + '_DataExport_' + (new Date()).toLocaleString('en-GB', { timeZone: 'Europe/London' }).replace(/[/:]/g, '-'),
                        className: 'btn btn-outline-success',
                        exportOptions: {
                          columns: ':not(:last-child)',
                        }
                      },
                      {
                        extend: 'pdfHtml5',
                        text: 'PDF Export',
                        title: this.refID + '_DataExport_' + (new Date()).toLocaleString('en-GB', { timeZone: 'Europe/London' }).replace(/[/:]/g, '-'),
                        orientation: 'landscape',
                        pageSize: 'A2',
                        className: 'btn btn-outline-success',
                        exportOptions: {
                          columns: ':not(:last-child)',
                        },
                      },
                  ],
              }"
          >
              <thead>
                  <tr>
                      <th style="display: none">userID</th>
                      <th style="display: none">refID</th>
                      <th style="display: none">Date of Birth</th>
                      <th style="display: none">Gender</th>
                      <th style="display: none">Occupation</th>
                      <th style="display: none">Understood Disclaimer</th>
                      <th style="display: none">Country</th>
                      <th style="display: none">beliefID</th>
                      <th>Date</th>
                      <th>Event Name</th>
                      <th>Description</th>
                      <th>Base Feeling</th>
                      <th>Emotion</th>
                      <th>Base Feeling Intensity</th>
                      <th style="display: none">Level 2</th>
                      <th style="display: none">Level 2 Helpfulness</th>
                      <th style="display: none">Level 3</th>
                      <th style="display: none">Level 4a</th>
                      <th style="display: none">Level 10</th>
                      <th style="display: none">Level 10 Agree</th>
                      <th style="display: none">Answer Log</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(belief) in beliefs" :key="belief.beliefID">
                      <td style="display: none">{{ this.userID }}</td>
                      <td style="display: none">{{ this.refID }}</td>
                      <td style="display: none">{{ this.dob }}</td>
                      <td style="display: none">{{ this.gender }}</td>
                      <td style="display: none">{{ this.occupation }}</td>
                      <td style="display: none">{{ this.understoodDisclaimer }}</td>
                      <td style="display: none">{{ this.country }}</td>
                      <td style="display: none">{{ belief.beliefID }}</td>
                      <td>{{ moment(belief.timestamp).format('DD/MM/YYYY HH:mm:ss') }}</td>
                      <td>{{ belief.eventName }}</td>
                      <td>{{ belief.description }}</td>
                      <td>{{ belief.baseFeeling }}</td>
                      <td>{{ belief.emotion }}</td>
                      <td>{{ belief.lv1Intensity }}</td>
                      <td style="display: none">{{ belief.level2 }}</td>
                      <td style="display: none">{{ belief.lv2Helpfulness }}</td>
                      <td style="display: none">{{ belief.level3 }}</td>
                      <td style="display: none">{{ belief.level4a }}</td>
                      <td style="display: none">{{ belief.level10 }}</td>
                      <td style="display: none">{{ belief.lv10Agree }}</td>
                      <td style="display: none">{{ belief.answerLog }}</td>
                      <td>
                          <router-link :to="`/app-user-management/${this.refID}/${belief.beliefID}`">
                              <b-button variant="primary">View</b-button>
                          </router-link>
                          <b-button variant="danger" @click="deleteBelief(belief.beliefID)">Delete</b-button>
                      </td>
                  </tr>
              </tbody>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
  </template>
  
<script>
  import { getUsersData, getUserBeliefsData } from '@/services/api.js'

  import DataTable from 'datatables.net-vue3';
  import DataTablesLib from 'datatables.net';
  import 'datatables.net-dt/css/jquery.dataTables.css';
  import 'datatables.net-buttons';
  import 'datatables.net-buttons/js/buttons.html5';
  import jszip from 'jszip';
  import pdfmake from 'pdfmake';
  import pdfFonts from "pdfmake/build/vfs_fonts";
  pdfmake.vfs = pdfFonts.pdfMake.vfs;
  import moment from 'moment';

  DataTable.use(DataTablesLib);
  DataTablesLib.Buttons.jszip(jszip);
  DataTablesLib.Buttons.pdfMake(pdfmake);
  
  export default {
    components: {
      DataTable,
    },
    data() {
        return {
            userID: '',
            refID: '',
            dob: '',
            age: '',
            gender: '',
            country: '',
            occupation: '',
            understoodDisclaimer: '',
            lastFeelingSubmitted: '',
            lastEmotionSubmitted: '',
            monthlySubmissions: 0,
            lastSubmissionDate: '',
            totalSubmissions: 0,
            beliefs: [],
            moment: moment,
        };
    },
    created() {
        this.getData();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      async getData() {
        const usersData = await getUsersData();
        const userBeliefsData = await getUserBeliefsData();
        this.getDetails(usersData);
        this.getStats(userBeliefsData);
      },
      async getDetails(usersData) {
        const routeId = parseInt(this.$route.params.id);

        const filteredData = usersData.filter(user => user.refID === routeId);
        this.userID = filteredData[0].userID;
        this.refID = filteredData[0].refID;
        this.dob = this.formatDate(filteredData[0].dob);
        this.age = this.calculateAge(this.dob);
        this.gender = filteredData[0].gender;
        this.country = filteredData[0].country;
        this.occupation = filteredData[0].occupation;
        this.understoodDisclaimer = filteredData[0].understoodDisclaimer;
      },
      formatDate(dob) {
        const dobString = dob;
        const [day, month, year] = dobString.split("/");
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
      },
      calculateAge(dob) {
        const birthDate = new Date(dob);
        const now = new Date();
        let age = now.getFullYear() - birthDate.getFullYear();
        const monthDiff = now.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      },
      async getStats(usersBeliefData){
        const routeId = this.userID;
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const lastMonthTimestamp = lastMonth.toISOString();

        const filteredData = usersBeliefData.filter(user => user.userID === routeId);
        this.beliefs = filteredData;
        if (filteredData.length > 0) {
          filteredData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          this.lastFeelingSubmitted = filteredData[0].baseFeeling;
          this.lastEmotionSubmitted = filteredData[0].emotion;
          const lastSubDate = new Date(filteredData[0].timestamp);
          this.lastSubmissionDate = lastSubDate.toLocaleDateString("en-GB", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
          });
          this.monthlySubmissions = filteredData.filter((item) => {
              return new Date(item.timestamp) > new Date(lastMonthTimestamp);
            }).length;
          this.totalSubmissions = filteredData.length;

        } else {
          console.log('No matching documents.');
          this.lastFeelingSubmitted = 'No submissions';
          this.lastSubmissionDate = 'No submissions';
          this.monthlySubmissions = 0;
          this.totalSubmissions = 0;
          return;
        }
      },
      deleteBelief(beliefID) {
        const db = firebase.firestore();
        db.collection('beliefs').doc(beliefID).delete().then(() => {
          console.log("Belief successfully deleted!");
          window.location.reload();
        }).catch((error) => {
          console.error("Error deleting belief: ", error);
        });
      }
    },
  }
  
  </script>
  
  <style scoped>

  @import 'datatables.net-dt';
  @import 'datatables.net-buttons-dt';

  .some-page-wrapper {
    width: 100%;
  }
  
  .row {
    display: flex;
    flex-wrap: wrap;
  }
  
  .column {
    display: flex;
    flex-direction: column;
    flex-basis: 100%;
    flex: 1;

  }
  .white-column {
    height: 4.3vh;
    font-weight: bold;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .button-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 20px;
    left: 0;
    right: 0;
    margin: auto;
  }
  .orange-column {
    height: 22vh;
    margin-left: -1%;
    padding-top: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .blue-column {
    height: 22vh;
    width: 101%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .green-column {
    height: 67vh;
    padding: 20px 50px 20px 50px;
    border-top: 1px solid black;
    overflow: auto;
  }

  .stats {
    display: flex;
    justify-content: center;
    align-items: center;
    
  }
  .details {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }
  .details p {
    margin: 0;
  }
  .column1 {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
  }
  .boxes {
    background-color: lightgrey;
    width: 25vh;
    max-width: 25vh;
    border-radius: 25px;
    border: 1px solid black;
    display: flex;
    font-size: 1vh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    margin-bottom: 20px;
    text-align: center;
  }
  .export {
    display: flex;
    justify-content: center;
  }
  .display .dt-buttons {
    text-align: center;
  }
  </style>