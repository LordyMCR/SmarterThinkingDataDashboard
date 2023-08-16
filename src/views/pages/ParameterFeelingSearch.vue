<template>
  <div class="some-page-wrapper">
    <div class="row">
      <div class="column">
        <div class="white-column">
            Select a Base Feeling to display a statistical report based on the selected parameter:
        </div>
      </div>
    </div>
    <div class="row">
      <div class="column">
          <div class="green-column">
              <div>
                  <b-dropdown id="dropdown-1" v-model="selected" text="Select Base Feeling">
                      <b-dropdown-item v-for="(item, index) in baseFeelings" :key="index" @click="goToReport(item, 'baseFeeling')">
                      {{ item }}
                      </b-dropdown-item>
                  </b-dropdown>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
  
<script>  
  import { getUserBeliefsData } from '@/services/api.js'
  
  export default {
      data() {
          return {
            baseFeelings: [],
            selected: '',
          };
      },
      async created() {
        const usersBeliefsRef = await getUserBeliefsData();
        const uniqueFeelings = new Set(usersBeliefsRef.map((item) => item.baseFeeling));
        const feelingsList = Array.from(uniqueFeelings);
        this.baseFeelings = feelingsList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      },
      methods: {
        goToReport(selected, dropdownParameter) {
          const route = { 
            name: 'Selected Feeling Parameter Report', 
            query: { s: dropdownParameter, q: selected },
          };
          this.$router.push(route);
        }
  
      }
  };
</script>
  
  
<style scoped>
  .some-page-wrapper {
      width: 100%;
      overflow: auto !important;
  }
  .row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
  }
  .column {
      display: flex;
      flex-direction: column;
      flex: 1;
  }
  .white-column {
      height: 8vh;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .green-column {
    height: 85vh;
    font-weight: bold;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly
  }
</style>