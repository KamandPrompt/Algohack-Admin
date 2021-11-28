var users = require('../models/users');
var problems = require('../models/problems');
var contest = require('../models/contest');

exports.homePage = async (req, res, next) => {
  return res.send(req.session.passport.user);
}

exports.getUser = async (req, res) => {
  await users.findOne({ _id: req.session.passport.user })
    .then((user) => {
      return res.send({ user: user })
    })
    .catch((err) => {
      return res.send(err);
    });
}

exports.isProblemCodeAvailable = async (req, res) => {
  await problems.findOne({ qID: req.params.qID })
    .then((problem) => {
      if (problem === null) {
        return res.send({ exists: false });
      } else {
        return res.send({ exists: true });
      }
    })
    .catch((err) => {
      return res.send(err);
    })
}

exports.createProblem = async (req, res) => {
  await problems.findOne({ qID: req.body.qID })
    .then((problem) => {
      if (problem === null) {
        var new_problem = new problems(req.body);
        new_problem.isPresentInContest = false;
        new_problem.save(function (err) {
          if (err) {
            return res.status(500).send({ message: err });
          } else {
            return res.status(200).send({ message: "SUCCESS" });
          }
        });
      } else {
        return res.status(401).send({ message: "Problem code already available" });
      }
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.getAllProblems = async (req, res) => {
  await problems.find({})
    .then((all_problems) => {
      return res.status(200).send(all_problems);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.getProblemFromqID = async (req, res) => {
  const qID = req.params.qID;
  await problems.findOne({ qID: qID })
    .then((problem) => {
      return res.status(200).send(problem);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.editProblem = async (req, res) => {
  await problems.findOneAndUpdate({ qID: req.body.qID }, req.body, { upsert: true })
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.deleteProblem = async (req, res) => {
  await problems.findOneAndDelete({ qID: req.params.qID })
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.editContestSetting = async (req, res) => {
  const edited_contest = new contest(req.body);
  await contest.findOne({})
    .then(async (setting) => {
      await contest.findOneAndUpdate({ _id: setting._id }, edited_contest)
        .then(() => {
          return res.status(200).send();
        })
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.getContestSetting = async (req, res) => {
  await contest.findOne({})
    .then((setting) => {
      return res.status(200).send(setting);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.getProblemsMetadata = async (req, res) => {
  var problemsMetadata = [];
  await problems.find({})
    .then((allProblems) => {
      allProblems.forEach(problem => {
        problemsMetadata.push({
          qID: problem.qID,
          isPresentInContest: problem.isPresentInContest
        })
      });
      return res.status(200).send(problemsMetadata);
    })
    .catch((err) => {
      console.log(err);
    })
}

exports.editProblemsVisibility = async (req, res) => {
  const problemsShouldPresentInContest = req.body;
  await problems.find({})
    .then(async (allProblems) => {
      allProblems.forEach(async problem => {
        // This `problem` should be present in the contest.
        if (!problem.isPresentInContest && problemsShouldPresentInContest.indexOf(problem.qID) != -1) {
          problem.isPresentInContest = true;
          await problems.findOneAndUpdate({ qID: problem.qID }, problem);
        }
        // This `problem` should NOT be present in the contest.
        else if (problem.isPresentInContest && problemsShouldPresentInContest.indexOf(problem.qID) == -1) {
          problem.isPresentInContest = false;
          await problems.findOneAndUpdate({ qID: problem.qID }, problem);
        }
      });
      return res.status(200).send();
    })
    .catch((err) => {
      console.log(err);
    })
}
