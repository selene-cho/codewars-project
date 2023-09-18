const ivm = require("isolated-vm");
const errorHandler = require("../middlewares/errors/errorHandling");
const Problem = require("../models/Problem");
const ERRORS = require("./messages");

exports.getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.problem_id);

    res.render("problem/problemDetail", { problem });
  } catch (err) {
    next(err);
  }
};

exports.submitSolution = async (req, res, next) => {
  let failedTests = [];
  let errorDetails = null;

  const memoryLimit = 128;
  const isolate = new ivm.Isolate({ memoryLimit });

  try {
    const userSolution = req.body.solution;
    const problem = await Problem.findById(req.params.problem_id);

    if (!problem) {
      throw new errorHandler(ERRORS.PROBLEM.NOT_FOUND, 500);
    }

    if (!userSolution.includes("solution(")) {
      return res.render("problem/failure", {
        message: ERRORS.PROBLEM.FAILURE,
        failedTests,
        errorDetails: ERRORS.PROBLEM.NO_SOLUTION_FUNC,
      });
    }

    const context = isolate.createContextSync();

    for (const test of problem.tests) {
      try {
        const runner =`
          ${userSolution};
          const result = solution(${test.input});
          result;
        `
        const script = isolate.compileScriptSync(runner);
        const result = script.runSync(context, { timeout: 5000 });
        const stringifiedResult = JSON.stringify(result);

        if (stringifiedResult !== test.solution) {
          failedTests.push({
            input: test.input,
            expected: test.solution,
            received: stringifiedResult,
          });
        }
      } catch (err) {
        if (err.message.includes("Script execution timed out.")) {
          return res.render("problem/failure", {
            message: ERRORS.PROBLEM.FAILURE,
            failedTests,
            errorDetails: ERRORS.PROBLEM.TIMEOUT,
          });
        }

        errorDetails = err.message;
        break;
      }
    }

    if (failedTests.length > 0 || errorDetails) {
      res.render("problem/failure", {
        message: ERRORS.PROBLEM.FAILURE,
        failedTests,
        errorDetails
      });
    } else {
      res.render("problem/success", { message: ERRORS.PROBLEM.SUCCESS });
    }
  } catch (err) {
    next(err);
  } finally {
    isolate.dispose();
  }
}
