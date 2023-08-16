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
          <div class='orange-column'>
            <p><b>Document ID:</b> {{ documentID }}<br>
            <b>Submission Date:</b> {{ timestamp }}</p>
            <p><b>Event Name:</b> {{ data.eventName }}<br>
            <b>Event Description:</b> {{ data.description }}</p>
            <p><b>Base Feeling:</b> {{ data.baseFeeling }}<br>
            <b>Emotion:</b> {{ data.emotion }}<br>
            <b>Level 1 - Intensity:</b> {{ data.lv1Intensity }}</p>
            <p><b>Level 2:</b> {{ data.level2 }}<br>
            <b>Level 2 - Helpfulness:</b> {{ data.lv2Helpfulness }}</p>
            <p><b>Level 3:</b> {{ data.level3 }}</p>
            <p><b>Level 4a:</b> {{ data.level4a }}</p>
            <p>
              <b>Answer Log:</b>
              <ul v-if="this.answerLog">
                <li v-for="key in Object.keys((this.answerLog)).sort()" :key="key">
                  <b>{{ key }}:</b> {{ this.answerLog[key] }}
                </li>
              </ul>
              <p v-else>No answer log available.</p>
            </p>
            <p><b>Level 10:</b> {{ data.level10 }}<br>
            <b>Level 10 - Agree:</b> {{ data.lv10Agree }}</p>
          </div>
        </div>
    </div>
  </div>
</template>
    
<script>
  import { getBeliefsData } from '@/services/api.js'
  
  export default {
    data() {
      return {
        documentID: '',
        data: '',
        timestamp: '',
        answerLog: {},
      };
    },
    created() {
      this.showBeliefData();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      async showBeliefData() {
        const routeId = this.$route.params.docID;
        this.documentID = routeId;

        const beliefsData = await getBeliefsData();
        const filteredData = beliefsData.filter(belief => belief.beliefID === routeId);
        if (filteredData.length > 0) {
          this.data = filteredData[0];
          this.timestamp = new Date(filteredData[0].timestamp).toLocaleString();
          this.answerLog = JSON.parse(filteredData[0].answerLog);
          return;
        } else {
          this.documentID = "No document found"
        }
      }
    },
  };


</script>
    
<style scoped>
.some-page-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1; 
}

.column {
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
  height: 88.5vh;
  width: 101%;
  padding: 1rem 3rem 1rem 3rem;

}
</style>