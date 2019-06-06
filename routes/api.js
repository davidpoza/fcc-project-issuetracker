"use strict";

const IssueController = require("../controllers/issue");

module.exports = function (app) {

    app.route("/api/issues/:project")

        .get(IssueController.getIssues)

        .post(IssueController.newIssue)

        .put(IssueController.updateIssue)

        .delete(IssueController.deleteIssue);

};
