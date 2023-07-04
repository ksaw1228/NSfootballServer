const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const path = require('path');
const axios = require('axios');
const cors = require('cors'); //var
const API_KEY = process.env.API_KEY

require('dotenv').config();


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use( '/', express.static( path.join(__dirname, 'public') ))
app.use(cors());

var db;
MongoClient.connect(process.env.MONGO_DB_URL,(err,client) => {
    if(err){return console.log(err)}
    db=client.db('football')
    app.listen(process.env.PORT,()=>{
        console.log(process.env.PORT+"on")
        getData();
        // setInterval(getData, 1000 * 60 * 60 * 1);
    })
})

function getData() {
  const leagues = ["PL", "BL1", "FL1", "PD", "SA"];
  leagues.map(updateDB);
}

async function updateDB(leagueName){
    const url = `https://api.football-data.org/v4/competitions/${leagueName}/matches?season=2023`
    const headers = { "X-Auth-Token": process.env.API_KEY}
    try {
      const response = await axios.get(url, { headers: headers });
      const matches = response.data.matches

      for (let i = 0; i < matches.length; i++) {
        db.collection(leagueName).findOneAndUpdate(
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
    console.log(leagueName+'updated!')
    }catch(error){
      console.error(error)
    }
}

async function newSeasonInsert(leagueName,season){
  const url = `https://api.football-data.org/v4/competitions/${leagueName}/matches?season=${season}`
  const headers = { "X-Auth-Token": API_KEY}

  const response = await axios.get(url, { headers: headers });
  const matches = response.data.matches

  for(let i=0; i<matches.length; i++){
    db.collection(leagueName).insertOne({
      id: matches[i].id,
      Date: matches[i].utcDate,
      MatchDay: matches[i].matchday,
      Home: matches[i].homeTeam.shortName,
      HomeIco: matches[i].homeTeam.crest,
      Away: matches[i].awayTeam.shortName,
      AwayIco: matches[i].awayTeam.crest,
      Score: `${matches[i].score.fullTime.home}:${matches[i].score.fullTime.away}`,
    })
}
console.log(leagueName+" New season inserted!")
}

app.get("/api/all", async (req, res) => {
  try {
    const leagues = ["PL", "BL1", "FL1", "PD", "SA"];
    const results = await Promise.all(leagues.map((league) => db.collection(league).find().toArray()));

    const data = results.reduce((acc, curr, index) => {
      acc[leagues[index]] = curr;
      return acc;
    }, {});

    res.status(200).json(data);
    console.log("API success, fetched data");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error." });
  }
});

app.get('/api/:id',async (req,res) => {
  const reqLeague = req.params.id
  console.log(reqLeague)
  const leagues = reqLeague.split('+')

  try {
    const results = await Promise.all(leagues.map((league) => db.collection(league).find().toArray()));

    const data = results.reduce((acc, curr, index) => {
      acc[leagues[index]] = curr;
      return acc;
    }, {});

    res.status(200).json(data);
    console.log("API success, fetched data");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error." });
  }
})
