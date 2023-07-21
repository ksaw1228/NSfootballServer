const express = require('express')
const router = express.Router()
const matchController = require("../controller/match.controller")


router.get("/all",matchController.getAll);

router.get('/:id',matchController.getSelected)

module.exports = router
