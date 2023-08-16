<template>
  <div class="some-page-wrapper">
    <div class="row">
      <div class="column">
        <div class="white-column">
            Select a User Parameter to display a statistical report based on the selected parameter:
        </div>
      </div>
    </div>
    <div class="row">
        <div class="column">
          <div class="green-column">
            <div>
              <b-dropdown id="dropdown-1" v-model="selected" text="Select Country">
                <b-dropdown-item v-for="(item, index) in countries" :key="index" @click="goToReport(item, 'Country')">
                  {{ item }}
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <div>
              <b-dropdown id="dropdown-2" v-model="selected" text="Select Age Range">
                <b-dropdown-item v-for="(item, index) in ageRanges" :key="index" @click="goToReport(item,  'Age Range')">
                  {{ item }}
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <div>
              <b-dropdown id="dropdown-3" v-model="selected" text="Select Gender">
                <b-dropdown-item v-for="(item, index) in genders" :key="index" @click="goToReport(item, 'Gender')">
                  {{ item }}
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <div>
              <b-dropdown id="dropdown-4" v-model="selected" text="Select Occupation">
                <b-dropdown-item v-for="(item, index) in occupations" :key="index" @click="goToReport(item, 'Occupation')">
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
              countries: [],
              ageRanges: [],
              genders: [],
              occupations: [],
              selected: '',
          };
      },
      async created() {

        const usersBeliefsRef = await getUserBeliefsData();
        
        const uniqueCountries = new Set(usersBeliefsRef.map((item) => item.country));
        const countryList = Array.from(uniqueCountries);
        this.countries = countryList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

        const uniqueAgeRanges = new Set(usersBeliefsRef.map((item) => this.calculateAgeRange(item.dob)));
        const ageRangeList = Array.from(uniqueAgeRanges);
        this.ageRanges = ageRangeList.sort();

        const uniqueGenders = new Set(usersBeliefsRef.map((item) => item.gender));
        const genderList = Array.from(uniqueGenders);
        this.genders = genderList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

        const uniqueOccupations = new Set(usersBeliefsRef.map((item) => item.occupation));
        const occupationList = Array.from(uniqueOccupations);
        this.occupations = occupationList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

      },
      methods: {
        calculateAgeRange(dob) {
          var [day, month, year] = dob.split('/');
          var birthDate = new Date(year, month - 1, day);
          var ageDiff = Date.now() - birthDate.getTime();
          var ageDate = new Date(ageDiff);
          var age = Math.abs(ageDate.getUTCFullYear() - 1970);

          if (age < 18) {
              return("Under 18");
          } else if (age < 25) {
              return("18-24");
          } else if (age < 35) {
              return("25-34");
          } else if (age < 45) {
              return("35-44");
          } else if (age < 55) {
              return("45-54");
          } else if (age < 65) {
              return("55-64");
          } else {
              return("65 and over");
          }
        },
        goToReport(selected, dropdownParameter) {
          const route = { 
            name: 'Selected User Parameter Report', 
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