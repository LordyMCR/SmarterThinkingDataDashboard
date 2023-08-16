<template>
  <div v-if ="metric === 'emotionCount'">{{ baseFeelingCount }}</div>
  <div v-else-if="metric === 'lastDate'">{{ lastSubmissionDate }}</div>
  <div v-else-if="metric === 'mostSelected'">
      <template v-if="mostSelectedEmotionsArray.length === 1">{{ mostSelectedEmotionsArray[0] }}</template>
      <template v-else>{{ mostSelectedEmotionsArray.join(', ') }}</template>
  </div>

</template>

<script>
import { getUserBeliefsData } from '@/services/api.js'

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
    baseFeelingCount: 0,
    mostSelectedEmotionsArray: [],
    lastSubmissionDate: '',
  };
},
async created() {   

  const submissions = await getUserBeliefsData();

  let count = 0;
  let counts = {};

  for (let i = 0; i < submissions.length; i++) {
    let submission = submissions[i];
    if (submissions[i].baseFeeling === this.parameter) {
      count++;
      let emotion = submission.emotion;
      if (emotion in counts) {
        counts[emotion]++;
      } else {
        counts[emotion] = 1;
      }
    }
  }
  this.baseFeelingCount = count;

  let highestCount = 0;
  let mostSelectedEmotion = [];

  for (let emotion in counts) {
    if (counts[emotion] > highestCount) {
      highestCount = counts[emotion];
      mostSelectedEmotion = [emotion];
    } else if (counts[emotion] === highestCount) {
      mostSelectedEmotion.push(emotion);
    }
  }
  this.mostSelectedEmotionsArray = mostSelectedEmotion;

  let timestampArray = [];
  for (let i = 0; i < submissions.length; i++) {
    if (submissions[i].baseFeeling === this.parameter) {
      timestampArray.push(submissions[i].timestamp);
    }
  }
  
  timestampArray.sort((a, b) => b - a);

  let lastSubmissionDate = new Date(timestampArray[0]).toLocaleDateString('en-GB');
  this.lastSubmissionDate = lastSubmissionDate

},
};

</script>