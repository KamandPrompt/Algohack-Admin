var express = require("express");
var router = express.Router();
var dashboard = require("../controls/dashboard");
const authMiddleware = require('../middleware/auth_middleware');

router.get('/', dashboard.homePage);

router.get('/user', authMiddleware, dashboard.getUser);

router.get('/qIDexists/:qID', dashboard.isProblemCodeAvailable);

router.post('/create-problem', dashboard.createProblem);

router.get('/all-problems', dashboard.getAllProblems);

router.get('/get-problem/:qID', dashboard.getProblemFromqID);

router.post('/edit/problem', dashboard.editProblem);

router.post('/delete/:qID', dashboard.deleteProblem);

router.post('/edit/contest-setting', dashboard.editContestSetting);

router.get('/get/contest-setting', dashboard.getContestSetting);

router.get('/get/problems-metadata', dashboard.getProblemsMetadata);

router.post('/edit/problems-visibility', dashboard.editProblemsVisibility);

module.exports = router;
