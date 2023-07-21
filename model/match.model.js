const axios = require('axios');
const MongoClient = require('mongodb').MongoClient
require('dotenv').config();

let season = 2023

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
  

//기점
async function updateAllLeagues() {
    const leagues = ["PL", "BL1", "FL1", "PD", "SA"];
    const promises = leagues.map((leagueName) => getApiAndGive(leagueName, season));
  
    try {
      // 프로미스 배열에서 모든 프로미스들이 완료될 때까지 기다립니다.
      await Promise.all(promises);
  
      console.log("All leagues updated.");
    } catch (error) {
      console.error("Error updating leagues:", error);
    }
  }
  
  async function getApiAndGive(leagueName, season) {
    // 외부 API에서 데이터를 가져옵니다.
    const matches = await getMatchesFromAPI(leagueName, season);
  
    // 가져온 데이터를 데이터베이스에 업데이트 합니다..
    await changeMatchesResultToDB(leagueName, matches);
  }
  
  //API 가져오는 함수
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
  
  //경기결과 DB업데이트 시키는 함수
  async function changeMatchesResultToDB(leagueName, matches) {
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
