<template>
    <div v-if="metric === 'total'">{{ monthlySubmissionsCount }}</div>
    <div v-else-if="metric === 'baseFeeling'">
        <template v-if="mostSelectedBaseFeelingsArray.length === 1">{{ mostSelectedBaseFeeling }}</template>
        <template v-else>{{ mostSelectedBaseFeelingsArray.join(', ') }}</template>
    </div>
    <div v-else-if="metric === 'emotion'">
        <template v-if="mostSelectedEmotionsArray.length === 1">{{ mostSelectedEmotion }}</template>
        <template v-else>{{ mostSelectedEmotionsArray.join(', ') }}</template>
    </div>
</template>

<script>
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

export default {
  props: {
    metric: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      monthlySubmissionsCount: 0,
      mostSelectedBaseFeeling: '',
      mostSelectedBaseFeelingsArray: [],
      mostSelectedEmotion: '',
      mostSelectedEmotionsArray: [],
    };
  },
  created() {
    const db = firebase.firestore();
    const resultsRef = db.collection('beliefs');
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthTimestamp = lastMonth.toISOString();
    
    resultsRef.where('timestamp', '>', lastMonthTimestamp).get()
    .then(querySnapshot => {
      this.monthlySubmissionsCount = querySnapshot.size;
      let countsFeelings = {};
      let countsEmotions = {};
      querySnapshot.docs.forEach(doc => {
        var belief = doc.data();
        var baseFeeling = belief.data.baseFeeling;
        if (baseFeeling in countsFeelings) {
          countsFeelings[baseFeeling]++;
        } else {
          countsFeelings[baseFeeling] = 1;
        }
        var emotion = belief.data.emotion;
        if (emotion in countsEmotions) {
          countsEmotions[emotion]++;
        } else {
          countsEmotions[emotion] = 1;
        }
      });
      this.mostSelectedBaseFeeling = Object.keys(countsFeelings).reduce((a, b) => countsFeelings[a] > countsFeelings[b] ? a : b);
      const maxCountFeelings = countsFeelings[this.mostSelectedBaseFeeling];
      this.mostSelectedBaseFeelingsArray = Object.keys(countsFeelings).filter(feeling => countsFeelings[feeling] === maxCountFeelings);
      this.mostSelectedEmotion = Object.keys(countsEmotions).reduce((a, b) => countsEmotions[a] >= countsEmotions[b] ? a : b);
      const maxCountEmotions = countsEmotions[this.mostSelectedEmotion];
      this.mostSelectedEmotionsArray = Object.keys(countsEmotions).filter(emotion => countsEmotions[emotion] === maxCountEmotions);
    })
    .catch(error => {
      console.error('Error getting results:', error);
    });  
    
    resultsRef.get()
    .then(querySnapshot => {
      this.totalCount = querySnapshot.size;
    })
    .catch(error => {
      console.error('Error getting results:', error);
    });
  },
};

</script>