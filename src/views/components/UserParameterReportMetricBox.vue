<template>
  <div v-if ="metric === 'userTotal'">{{ userCount }}</div>
  <div v-else-if="metric === 'subTotal'">{{ subCount }}</div>
  <div v-else-if="metric === 'baseFeeling'">
      <template v-if="mostSelectedEmotionsArray.length === 1">{{ mostSelectedEmotionsArray[0] }}</template>
      <template v-else>{{ mostSelectedEmotionsArray.join(', ') }}</template>
  </div>
</template>

<script>
import { getUsersData, getUserBeliefsData } from '@/services/api.js'

export default {
  props: {
    category: {
      type: String,
      required: true,
    },
    parameter: {
      type: String,
      required: true,
    },
    metric: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      userCount: 0,
      subCount: 0,
      mostSelectedEmotionsArray: [],
    };
  },
  async created() {   

    const usersData = await getUsersData();
    const submissions = await getUserBeliefsData();
        
    let countsAgeUsers = {
      'Under 18': 0,
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55-64': 0,
      '65 and over': 0
    };

    let userCounts = {};
    for (let i = 0; i < usersData.length; i++) {
      let users = usersData[i];
      if (this.category === "Age Range") {
        var dob = users.dob;
        var [day, month, year] = dob.split('/');
        var birthDate = new Date(year, month - 1, day);
        var ageDiff = Date.now() - birthDate.getTime();
        var ageDate = new Date(ageDiff);
        var age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (age < 18) {
          countsAgeUsers['Under 18']++;
        } else if (age < 25) {
          countsAgeUsers['18-24']++;
        } else if (age < 35) {
          countsAgeUsers['25-34']++;
        } else if (age < 45) {
          countsAgeUsers['35-44']++;
        } else if (age < 55) {
          countsAgeUsers['45-54']++;
        } else if (age < 65) {
          countsAgeUsers['55-64']++;
        } else {
          countsAgeUsers['65 and over']++;
        }
      } else {
        let categoryFormatted = this.category.toLowerCase();
        var metricValue = users[categoryFormatted];
        if (metricValue in userCounts) {
          userCounts[metricValue]++;
        } else {
          userCounts[metricValue] = 1;
        }
      }
    }

    let resultUsers = userCounts[this.parameter] ? userCounts[this.parameter] : 0;
    if (resultUsers > 0) {
      this.userCount = resultUsers;
    } else {
      this.userCount = countsAgeUsers[this.parameter];
    }
    let countsAge = {
      'Under 18': 0,
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45-54': 0,
      '55-64': 0,
      '65 and over': 0
    };
    let countsAgeEmotion = {
      'Under 18': [],
      '18-24': [],
      '25-34': [],
      '35-44': [],
      '45-54': [],
      '55-64': [],
      '65 and over': []
    }

    let beliefCounts = {};
    let beliefCountsEmotion = [];

    for (let i = 0; i < submissions.length; i++) {
      let beliefs = submissions[i];
      if (this.category === "Age Range") {
        var dob = beliefs.dob;
        var [day, month, year] = dob.split('/');
        var birthDate = new Date(year, month - 1, day);
        var ageDiff = Date.now() - birthDate.getTime();
        var ageDate = new Date(ageDiff);
        var age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (age < 18) {
          countsAge['Under 18']++;
          countsAgeEmotion['Under 18'].push(beliefs[this.metric])
        } else if (age < 25) {
          countsAge['18-24']++;
          countsAgeEmotion['18-24'].push(beliefs[this.metric])
        } else if (age < 35) {
          countsAge['25-34']++;
          countsAgeEmotion['25-34'].push(beliefs[this.metric])
        } else if (age < 45) {
          countsAge['35-44']++;
          countsAgeEmotion['35-44'].push(beliefs[this.metric])
        } else if (age < 55) {
          countsAge['45-54']++;
          countsAgeEmotion['45-54'].push(beliefs[this.metric])
        } else if (age < 65) {
          countsAge['55-64']++;
          countsAgeEmotion['55-64'].push(beliefs[this.metric])
        } else {
          countsAge['65 and over']++;
          countsAgeEmotion['65 and over'].push(beliefs[this.metric])
        }
      } else {
        let categoryFormatted = this.category.toLowerCase();
        var metricValue = beliefs[categoryFormatted];
        if (metricValue in beliefCounts) {
          beliefCounts[metricValue]++;
        } else {
          beliefCounts[metricValue] = 1;
        }
        if (!beliefCountsEmotion[metricValue]) {
          beliefCountsEmotion[metricValue] = [];
        }
        beliefCountsEmotion[metricValue].push(beliefs[this.metric])
      }
    }

    let result = beliefCounts[this.parameter] ? beliefCounts[this.parameter] : 0;
    if (result > 0) {
      this.subCount = result;
    } else {
      this.subCount = countsAge[this.parameter];
    }

    let resultEmotion = beliefCountsEmotion[this.parameter] ? beliefCountsEmotion[this.parameter] : 0;

    if (resultEmotion.length > 0) {
      let emotionCount = {};
      for (let i = 0; i < resultEmotion.length; i++) {
        if (resultEmotion[i] in emotionCount) {
          emotionCount[resultEmotion[i]]++;
        } else {
          emotionCount[resultEmotion[i]] = 1;
        }
      }          
      let highestCount = 0;
      let mostSelectedEmotion = [];

      for (let emotion in emotionCount) {
        if (emotionCount[emotion] > highestCount) {
          highestCount = emotionCount[emotion];
          mostSelectedEmotion = [emotion];
        } else if (emotionCount[emotion] === highestCount) {
          mostSelectedEmotion.push(emotion);
        }
      }
      this.mostSelectedEmotionsArray = mostSelectedEmotion;
    } else {
      let emotionCount = {};
      let parameterArray = countsAgeEmotion[this.parameter];
      for (let i = 0; i < parameterArray.length; i++) {
        if (countsAgeEmotion[this.parameter][i] in emotionCount) {
          emotionCount[countsAgeEmotion[this.parameter][i]]++;
        } else {
          emotionCount[countsAgeEmotion[this.parameter][i]] = 1;
        }
      }          
      let highestCount = 0;
      let mostSelectedEmotion = [];

      for (let emotion in emotionCount) {
        if (emotionCount[emotion] > highestCount) {
          highestCount = emotionCount[emotion];
          mostSelectedEmotion = [emotion];
        } else if (emotionCount[emotion] === highestCount) {
          mostSelectedEmotion.push(emotion);
        }
      }
      this.mostSelectedEmotionsArray = mostSelectedEmotion;
    }
  },
};

</script>