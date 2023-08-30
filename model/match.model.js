const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

let season = 2023;

// DB 연결
const dbPromise = new Promise((resolve, reject) => {
  MongoClient.connect(process.env.MONGO_DB_URL, (err, client) => {
    if (err) {
      console.log(err);
      reject(err);
      return;
    }
    const db = client.db("football");
    resolve(db);
  });
});

// 모든 리그 업데이트 시작
async function updateAllLeagues() {
  const leagues = ["PL", "BL1", "FL1", "PD", "SA"];
  
  // 모든 리그에 대해 API 호출 및 DB 업데이트 진행
  for (let leagueName of leagues) {
    await getApiAndGive(leagueName, season);
    
    // 첫 경기 시작 시간과 마지막 경기 종료 시간 사이를 계산하여 setTimeout으로 설정
    let firstMatchStartTime = await db.collection(leagueName).find().sort({Date:1}).limit(1).toArray(); 
    let lastMatchEndTime; await db.collection(leagueName).find().sort({Date:-1}).limit(1).toArray();

    let currentTime = new Date();
    
    // 첫 경기까지 남은 시간 계산 
    let timeUntilFirstMatchStarts = firstMatchStartTime - currentTime;

    setTimeout(() => {

      // 외부 API를 1분마다 호출하는 루프(loop)
      let intervalId = setInterval(async () => {

        await getApiAndGive(leagueName, season);

        if(new Date() >= lastMatchEndTime){
          clearInterval(intervalId); 
          console.log("Last match ended. Stopping updates.");
        }

      }, 60 * 1000); 

     }, timeUntilFirstMatchStarts);

   }
}

//API 받고 업데이트함수에 넣어주기
async function getApiAndGive(leagueName, season) {
   const matches = await getMatchesFromAPI(leagueName, season);

   await changeMatchesResultToDB(leagueName, matches);
}

//외부 API 호출
async function getMatchesFromAPI(leagueName, season) {
   const url = `https://api.football-data.org/v4/competitions/${leagueName}/matches?season=${season}`;
   const headers = { "X-Auth-Token": process.env.API_KEY };

   try {
     const response = await axios.get(url, { headers: headers });
     console.log(`get ${leagueName} API sucess`)
     return response.data.matches;
   } catch (error) {
     console.error("Error fetching data from API:", error);
     return [];
   }
}
  
  //경기결과 DB에 업데이트
  async function changeMatchesResultToDB(leagueName, matches) {
    const db = await dbPromise;
    for (let i = 0; i < matches.length; i++) {
      await db.collection(leagueName).findOneAndUpdate(
        { id: matches[i].id },
        {
          $set: {
            Date: matches[i].utcDate,
            MatchDay: matches[i].matchday,
            Home: matches[i].homeTeam.shortName,
            HomeIco: matches[i].homeTeam.crest,
            Away: matches[i].awayTeam.shortName,
            AwayIco: matches[i].awayTeam.crest,
            Score: `${matches[i].score.fullTime.home}:${matches[i].score.fullTime.away}`,
          },
        }
      );
    }
    console.log(leagueName + " updated!");
  }

  module.exports = {updateAllLeagues,dbPromise}
