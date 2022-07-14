const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const authentication = require("../middlewares/authentication")
const cardController = require("../controllers/cardController")


router.post('/createUser', userController.createUser)
router.post('/login', userController.loginUser)

router.post('/createCard', authentication.authenticate, cardController.createBusiessCard)
router.get("/getBusinessCard/:userId", cardController.getBusinessCards)


module.exports = router;
