<template>
  <div class="some-page-wrapper">
    <div class="row">
      <div class="column">
        <div class="white-column">
            <div class="paragraph">
                <p>Select a button below to extract either the User Data, or the User's Belief Data as a CSV file:</p>
            </div>
        </div>
        <div class="button-column">
            <div>
                <download-csv
                  :data="user_data"
                  :name="'UserDataExport_' + (new Date()).toLocaleString('en-GB', { timeZone: 'Europe/London' }).replace(/[/:]/g, '-') + '.csv'"
                >
                  <b-button variant="primary">Export User Data as CSV</b-button>
                </download-csv>
            </div>
            <div>
                <download-csv
                  :data="belief_data"
                  :name="'UserBeliefsDataExport_' + (new Date()).toLocaleString('en-GB', { timeZone: 'Europe/London' }).replace(/[/:]/g, '-') + '.csv'"
                >
                  <b-button variant="primary">Export User Beliefs Data as CSV</b-button>
                </download-csv>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
    import JsonCSV from 'vue-json-csv'
    import { getUsersData, getUserBeliefsData } from '@/services/api.js'
    
    export default {
        components: {
        'download-csv': JsonCSV
        },
        data() {
            return {
                user_data: [],
                belief_data: [],
            };
        },
        async created() {
            this.user_data = await getUsersData();
            this.belief_data = await getUserBeliefsData();
        },
    };
</script>

<style scoped>

  .some-page-wrapper {
      width: 100%;
  }
  .row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
  }
  .column {
      display: flex;
      flex-direction: column;
      flex-basis: 100%;
      flex: 1;
  }
  .white-column {
      height: 10.8vh;
      text-align: center;
      font-weight: bold;
      display: flex;
      justify-content: center;
  }
  .paragraph {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .button-column {
      height: 82vh;
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;

  }
</style>
  
  
  