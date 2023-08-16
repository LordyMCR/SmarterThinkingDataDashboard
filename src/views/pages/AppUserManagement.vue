<template>
    <div class="some-page-wrapper">
        <div class="row">
            <div class="column">
            <div class="boxes">
                <b>Total Number of Registered Users</b>
                <i>{{ this.totalNumUsers }}</i>
            </div>
            <div class="boxes">
                <b>Percentage of Users with at least 1 Belief Submission</b>
                <i>{{ this.userBeliefPercentage }}%</i>
            </div>
            <div class="boxes">
                <b>Last Belief Submission Date - All Users</b>
                <i>{{ moment(this.lastSubmissionDate).format("DD/MM/YYYY") }}</i>
            </div>
            </div>
        </div>
        <div id="userTable">
            <DataTable 
                v-if="users.length > 0"
                class="display"
                :options="{
                    pageLength: 10,
                    autoWidth: true,
                    order: [[0, 'asc']],
                    select: true,
                }"
            >
                <thead>
                    <tr>
                        <th>refID</th>
                        <th>Total Belief Submissions</th>
                        <th>Last Belief Submission Date</th>
                        <th>DOB</th>
                        <th>Gender</th>
                        <th>Country</th>
                        <th>Occupation</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users" :key="user.refID">
                        <td>{{ user.refID }}</td>
                        <td>{{ this.eachCountArray.find(item => item.refID === user.refID).count }}</td>
                        <td>
                            {{ 
                                this.eachCountArray.find(item => item.refID === user.refID).lastSubmissionDate
                                ? moment(this.eachCountArray.find(item => item.refID === user.refID).lastSubmissionDate).format('YYYY-MM-DD')
                                : ''
                            }}
                        </td>
                        <td>{{ formatDate(user.dob) }}</td>
                        <td>{{ user.gender }}</td>
                        <td>{{ user.country }}</td>
                        <td>{{ user.occupation }}</td>
                        <td>
                            <router-link :to="`/app-user-management/${user.refID}`">
                                <b-button variant="primary">View</b-button>
                            </router-link>
                        </td>
                        </tr>    
                </tbody>
            </DataTable>
        </div>
    </div>
</template>

<script>
  import DataTable from 'datatables.net-vue3';
  import DataTablesCore from 'datatables.net';
  import moment from 'moment';

  import { getUsersData, getUserBeliefsData } from '@/services/api.js'

  import 'datatables.net-dt/css/jquery.dataTables.css';
  DataTable.use(DataTablesCore);

  export default {
      components: {
          DataTable
      },
      data() {
          return {
              users: [],
              eachCountArray: [],
              totalNumUsers: 0,
              userBeliefPercentage: 0,
              lastSubmissionDate: "",
              moment: moment,
          };
      },
      created() {
        this.loadTable();
      },
      methods: {
        async loadTable() {
            const usersData = await getUsersData();
            this.users = usersData;
            const lastSubArray = [];
            const usersBeliefData = await getUserBeliefsData();
            let beliefDupRemoval = usersBeliefData.filter((belief, index, self) =>
                    index === self.findIndex((t) => (
                        t.userID === belief.userID
                    ))
                );

            let beliefCount = beliefDupRemoval.length;
            let usersLength = usersData.length;
            this.userBeliefPercentage = ((beliefCount/usersLength)*100).toFixed(2);
            this.totalNumUsers = usersLength;

            usersData.forEach(user => {
                let count = 0;
                let lastSubmissionDate = null;
                usersBeliefData.forEach(belief => {
                    if (belief.userID === user.userID) {
                        count++;
                        const beliefDate = belief.timestamp;
                        if (lastSubmissionDate === null || beliefDate > lastSubmissionDate) {
                            lastSubmissionDate = beliefDate;
                        }
                    }
                });
                const formattedDate = lastSubmissionDate ? lastSubmissionDate : null;
                if (formattedDate !== null) {
                    lastSubArray.push({'refID': user.refID, count: count, lastSubmissionDate: new Date(formattedDate)});
                }
                this.eachCountArray.push({'refID': user.refID, count: count, lastSubmissionDate: formattedDate});
                
            });

            this.eachCountArray.sort((a, b) => a.refID - b.refID);
            lastSubArray.sort((a, b) => b.lastSubmissionDate - a.lastSubmissionDate);
            this.lastSubmissionDate = lastSubArray[0].lastSubmissionDate;
        },
        formatDate(dob) {
            const dobString = dob;
            const [day, month, year] = dobString.split("/");
            const date = (`${year}-${month}-${day}`);
            return date;
        },
      }
    };
</script>

<style scoped>
@import 'datatables.net-dt';

.some-page-wrapper {
    height: auto !important;
    background-color: #ededed
}

#userTable {
    padding: 10px 30px 30px 30px;

}
.display {
    background: white;
}
.row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
}
.column {
    display: flex;
    flex-direction: row;
    height: 12.5vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 20px;
}

.boxes {
    background-color: rgb(175, 175, 175);
    height: 90%;
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

</style>
