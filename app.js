const express = require('express')
const app = express()
// const MongoClient = require('mongodb').MongoClient
// const axios = require('axios');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const updateAllLeagues = require("./model/match.model");
const matchController = require("./controller/match.controller")


let seasonStarted = false

require('dotenv').config();

//최대 요청 제한
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/", apiLimiter)
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


app.get("/api/all",matchController.getAll);

app.get('/api/:id',async (req,res) => {
  const reqLeague = req.params.id
  //데이터검증
  if(reqLeague.length > 20){
    res.send(500)
  }else{
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
  }
})

app.listen(process.env.PORT,()=>{
  console.log(process.env.PORT+"on")
  updateAllLeagues.updateAllLeagues()//1시간에 한번씩 추가해야댐
})


