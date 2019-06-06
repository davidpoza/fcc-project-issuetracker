"use strict";

const Issue      = require("../models/issue");
const errorTypes = require("./error_types");

const controller  = {
    newIssue: (req,res,next) => {
        if(!req.body.issue_title || !req.body.issue_text || !req.body.created_by)
            throw new errorTypes.Error400("missing inputs");
        let issue = new Issue({
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to ? req.body.assigned_to:"",
            status_text: req.body.status_text ? req.body.status_text:"",
            project_name: req.params.project
        });
        issue.save()
            .then(data=>{
                res.json(data);
            })
            .catch(err=>next(err));
    },
    getIssues: (req,res,next) => {
        let filter = {};
        filter["project_name"] = req.params.project;
        if(req.query.issue_title) filter["issue_title"] = req.query.issue_title;
        if(req.query.issue_text) filter["issue_text"] = req.query.issue_text;
        if(req.query.created_by) filter["created_by"] = req.query.created_by;
        if(req.query.assigned_to) filter["assigned_to"] = req.query.assigned_to;
        if(req.query.status_text) filter["status_text"] = req.query.status_text;
        if(req.query.created_on) filter["created_on"] = req.query.created_on;
        if(req.query.updated_on) filter["updated_on"] = req.query.updated_on;
        if(req.query.open) filter["open"] = req.query.open;
        Issue.find(filter).lean().exec()
            .then(data=>{
                res.json(data);
            })
            .catch(err=>next(err));
    },
    deleteIssue: (req,res,next) => {
        if(!req.body._id)
            throw new errorTypes.Error400("_id error");
        Issue.deleteOne({_id: req.body._id, project_name: req.params.project})
            .then((data)=>{
                if(data.deletedCount == 1)
                    res.send("deleted " + req.body._id);
                else
                    throw new errorTypes.Error404("could not delete " + req.body._id);
            })
            .catch(err=>next(err));
    },
    updateIssue: (req, res, next) => {
        let update = {};
        if(!req.body._id)
            throw new errorTypes.Error400("no updated field sent");
        if (!req.body.issue_title && !req.body.issue_text && !req.body.assigned_to
            && !req.body.status_text && !req.body.open && !req.body.created_by)
            throw new errorTypes.Error400("no updated field sent");

        if(req.body.issue_title) update["issue_title"] = req.body.issue_title;
        if(req.body.issue_text) update["issue_text"] = req.body.issue_text;
        if(req.body.assigned_to) update["assigned_to"] = req.body.assigned_to;
        if(req.body.status_text) update["status_text"] = req.body.status_text;
        if(req.body.open) update["open"] = req.body.open;
        if(req.body.created_by) update["created_by"] = req.body.created_by;
        update["updated_on"] = new Date();

        Issue.findOneAndUpdate({_id: req.body._id, project_name: req.params.project}, update)
            .then((data)=>{
                if(data)
                    res.send("successfully updated");
                else
                    throw new errorTypes.Error500("");
            })
            .catch(()=>next(new errorTypes.Error500("could not update "+req.body._id)));

    }

};


module.exports = controller;