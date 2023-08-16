import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  // Firebase API Keys removed
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


export async function getUsersData() {
  
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();
  const usersData = [];

  snapshot.forEach((doc) => {
    const userData = {
      userID: doc.data().userID,
      refID: doc.data().refID,
      dob: doc.data().dob,
      gender: doc.data().gender,
      occupation: doc.data().occupation,
      understoodDisclaimer: doc.data().understoodDisclaimer,
      country: doc.data().country,
    };
    usersData.push(userData);
  });
  
  return usersData;
}

export async function getBeliefsData() {
  
  const beliefsRef = db.collection("beliefs");
  const snapshot = await beliefsRef.get();
  const beliefsData = [];

  snapshot.forEach((doc) => {
    const beliefData = {
      timestamp: doc.data().timestamp,
      beliefID: doc.id,
      userID: doc.data().userID,
      emotion: doc.data().data.emotion,
      baseFeeling: doc.data().data.baseFeeling,
      lv1Intensity: doc.data().data.lv1Intensity,
      level2: doc.data().data.level2,
      lv2Helpfulness: doc.data().data.lv2Helpfulness,
      level3: doc.data().data.level3,
      level4a: doc.data().data.level4a,
      level10: doc.data().data.level10,
      lv10Agree: doc.data().data.lv10Agree,
      eventName: doc.data().data.eventName,
      description: doc.data().data.description,
      answerLog: JSON.stringify(doc.data().data.answerLog),
    };
    beliefsData.push(beliefData);
  });
  
  return beliefsData;
}

export async function getUserBeliefsData() {
  const usersData = await getUsersData();
  const beliefsData = await getBeliefsData();

  let userBeliefsData = [];
  for (let i = 0; i < beliefsData.length; i++) {
    for (let j = 0; j < usersData.length; j++) {
      if (beliefsData[i].userID === usersData[j].userID) {
        const row = {
          userID: usersData[j].userID,
          refID: usersData[j].refID,
          dob: usersData[j].dob,
          gender: usersData[j].gender,
          occupation: usersData[j].occupation,
          understoodDisclaimer: usersData[j].understoodDisclaimer,
          country: usersData[j].country,
          timestamp: beliefsData[i].timestamp,
          beliefID: beliefsData[i].beliefID,
          emotion: beliefsData[i].emotion,
          baseFeeling: beliefsData[i].baseFeeling,
          lv1Intensity: beliefsData[i].lv1Intensity,
          level2: beliefsData[i].level2,
          lv2Helpfulness: beliefsData[i].lv2Helpfulness,
          level3: beliefsData[i].level3,
          level4a: beliefsData[i].level4a,
          level10: beliefsData[i].level10,
          lv10Agree: beliefsData[i].lv10Agree,
          eventName: beliefsData[i].eventName,
          description: beliefsData[i].description,
          answerLog: beliefsData[i].answerLog,
        };
        userBeliefsData.push(row);
        break;
      }
    }
  }
  return userBeliefsData;
}
