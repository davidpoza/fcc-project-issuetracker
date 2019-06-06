"use strict";

const mongoose       = require("mongoose");
const Schema         = mongoose.Schema;

const IssueSchema = Schema({
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by: {type: String, required: true},
    assigned_to: String,
    status_text: String,
    created_on: Date,
    updated_on: Date,
    open: Boolean,
    project_name: {type: String, required: true}
});

IssueSchema.pre("save", function(next) {
    this.created_on = new Date(),
    this.updated_on = new Date(),
    this.open = true,
    next();
});

module.exports = mongoose.model("Issue", IssueSchema, "issues");