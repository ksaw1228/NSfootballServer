const express = require('express')
const app = express()
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const updateAllLeagues = require("./model/match.model");
const apiRouters = require('./routes/match.router')

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

app.use('/api',apiRouters)


app.listen(process.env.PORT,()=>{
  console.log(process.env.PORT+"on")
  if(seasonStarted){setInterval(updateAllLeagues.updateAllLeagues, 60 * 60 * 1000)}
})


