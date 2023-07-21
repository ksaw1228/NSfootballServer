const { dbPromise } = require("../model/match.model");

exports.getAll = async(req,res) => {

    try {
        const db = await dbPromise;
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
}