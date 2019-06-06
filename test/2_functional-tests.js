/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require("chai-http");
const chai     = require("chai");
const assert   = chai.assert;

const server   = require("../server");
const Issue    = require("../models/issue");

chai.use(chaiHttp);

function mySetup(done){
    Issue.deleteMany({})
        .then(()=>{
            let issue = new Issue({
                _id: "5cf8f0b0ebd0563a2c93f2e1",
                issue_title: "Prueba 1",
                issue_text: "contenido",
                created_by: "David",
                project_name: "test",
                assigned_to: "Paco",
                status_text: "En proceso"
            });
            return issue.save();
        })
        .then(()=>{
            let issue2 = new Issue({
                _id: "5cf8f0b0ebd0563a2c93f2e2",
                issue_title: "Prueba 2",
                issue_text: "contenido",
                created_by: "Luis",
                project_name: "test",
                assigned_to: "Paco",
                status_text: "In process",
            });
            return issue2.save();
        })
        .then(()=>{
            let issue3 = new Issue({
                _id: "5cf8f0b0ebd0563a2c93f2e3",
                issue_title: "Prueba 3",
                issue_text: "contenido",
                created_by: "Luis",
                project_name: "test",
                assigned_to: "Paco",
                status_text: "Finished",
            });
            return issue3.save();
        })
        .then(()=>done())
        .catch(err=>done(err));
}

function myTeardown(done){
    Issue.deleteMany({})
        .then(()=>done())
        .catch(err=>done(err));
}

suite("Functional Tests", function() {
    suiteSetup(mySetup);
    suiteTeardown(myTeardown);
    suite("POST /api/issues/{project} => object with issue data", function() {

        test("Every field filled in", function(done) {
            chai.request(server)
                .post("/api/issues/test")
                .send({
                    issue_title: "Title",
                    issue_text: "text",
                    created_by: "Functional Test - Every field filled in",
                    assigned_to: "Chai and Mocha",
                    status_text: "In QA"
                })
                .then(res => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, "issue_title", "return contains issue_title");
                    assert.property(res.body, "issue_text", "return contains issue_text");
                    assert.property(res.body, "created_by", "return contains created_by");
                    assert.property(res.body, "assigned_to", "return contains assigned_to");
                    assert.property(res.body, "status_text", "return contains status_text");
                    assert.property(res.body, "open", "return contains open");
                    assert.property(res.body, "created_on", "return contains created_on");
                    assert.property(res.body, "updated_on", "return contains updated_on");
                    assert.equal(res.body.open, true, "issue created as open");
                    done();
                })
                .catch(err=>done(err));
        });

        test("Required fields filled in", function(done) {
            chai.request(server)
                .post("/api/issues/test")
                .send({
                    issue_title: "Title",
                    issue_text: "text",
                    created_by: "Functional Test - Every field filled in",
                })
                .then(res => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, "issue_title", "return contains issue_title");
                    assert.property(res.body, "issue_text", "return contains issue_text");
                    assert.property(res.body, "created_by", "return contains created_by");
                    assert.property(res.body, "assigned_to", "return contains assigned_to");
                    assert.property(res.body, "status_text", "return contains status_text");
                    assert.property(res.body, "open", "return contains open");
                    assert.property(res.body, "created_on", "return contains created_on");
                    assert.property(res.body, "updated_on", "return contains updated_on");
                    assert.equal(res.body.open, true, "issue created as open");
                    assert.equal(res.body.assigned_to, "", "return contains assigned_to as blank");
                    assert.equal(res.body.status_text, "", "return contains status_text as blank");
                    done();
                })
                .catch(err=>done(err));
        });

        test("Missing required fields", function(done) {
            chai.request(server)
                .post("/api/issues/test")
                .send({
                    issue_title: "Title",
                })
                .then(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.text, "missing inputs", "returns correct error message");
                    done();
                })
                .catch(err=>done(err));
        });

    });

    suite("PUT /api/issues/{project} => text", function() {

        test("No body", function(done) {
            chai.request(server)
                .put("/api/issues/test")
                .then(res => {
                    assert.equal(res.status, 400);
                    assert.equal(res.text, "no updated field sent", "returns correct error message");
                    done();
                })
                .catch(err=>done(err));
        });

        test("One field to update", function(done) {
            chai.request(server)
                .put("/api/issues/test")
                .send({_id: "5cf8f0b0ebd0563a2c93f2e1", issue_title: "issue_title changed"})
                .then(res => {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, "successfully updated", "returns correct success message");
                    Issue.findOne({_id: "5cf8f0b0ebd0563a2c93f2e1"})
                        .then(data=>{
                            assert.equal(data.issue_title, "issue_title changed", "the change has been applied");
                        })
                        .catch(err=>{throw err;});
                    done();
                })
                .catch(err=>done(err));
        });

        test("Multiple fields to update", function(done) {
            chai.request(server)
                .put("/api/issues/test")
                .send({_id: "5cf8f0b0ebd0563a2c93f2e1", issue_title: "issue_title changed again", issue_text: "changed content"})
                .then(res => {
                    assert.equal(res.status, 200);
                    assert.equal(res.text, "successfully updated", "returns correct success message");
                    Issue.findOne({_id: "5cf8f0b0ebd0563a2c93f2e1"})
                        .then(data=>{
                            assert.equal(data.issue_title, "issue_title changed again", "the change has been applied");
                            assert.equal(data.issue_text, "changed content", "the change has been applied");
                        })
                        .catch(err=>{throw err;});
                    done();
                })
                .catch(err=>done(err));
        });

    });

    suite("GET /api/issues/{project} => Array of objects with issue data", function() {

        test("No filter", function(done) {
            chai.request(server)
                .get("/api/issues/test")
                .query({})
                .then(res=>{
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.property(res.body[0], "issue_title");
                    assert.property(res.body[0], "issue_text");
                    assert.property(res.body[0], "created_on");
                    assert.property(res.body[0], "updated_on");
                    assert.property(res.body[0], "created_by");
                    assert.property(res.body[0], "assigned_to");
                    assert.property(res.body[0], "open");
                    assert.property(res.body[0], "status_text");
                    assert.property(res.body[0], "_id");
                    done();
                })
                .catch(err=>done(err));
        });

        test("One filter", function(done) {
            chai.request(server)
                .get("/api/issues/test")
                .query({created_by: "Luis"})
                .then(res=>{
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.equal(res.body.length, 2, "this filter must return 2 objects");
                    assert.property(res.body[0], "issue_title");
                    assert.property(res.body[0], "issue_text");
                    assert.property(res.body[0], "created_on");
                    assert.property(res.body[0], "updated_on");
                    assert.property(res.body[0], "created_by");
                    assert.property(res.body[0], "assigned_to");
                    assert.property(res.body[0], "open");
                    assert.property(res.body[0], "status_text");
                    assert.property(res.body[0], "_id");
                    assert.equal(res.body[0].issue_title, "Prueba 2", "The filtered issue is correct");
                    done();
                })
                .catch(err=>done(err));
        });

        test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
            chai.request(server)
                .get("/api/issues/test")
                .query({created_by: "Luis", status_text:"Finished"})
                .then(res=>{
                    assert.equal(res.status, 200);
                    assert.isArray(res.body);
                    assert.equal(res.body.length, 1, "this filter must return one object");
                    assert.property(res.body[0], "issue_title");
                    assert.property(res.body[0], "issue_text");
                    assert.property(res.body[0], "created_on");
                    assert.property(res.body[0], "updated_on");
                    assert.property(res.body[0], "created_by");
                    assert.property(res.body[0], "assigned_to");
                    assert.property(res.body[0], "open");
                    assert.property(res.body[0], "status_text");
                    assert.property(res.body[0], "_id");
                    assert.equal(res.body[0].issue_title, "Prueba 3", "The filtered issue is correct");
                    done();
                })
                .catch(err=>done(err));
        });

    });

    suite("DELETE /api/issues/{project} => text", function() {

        test("No _id", function(done) {
            chai.request(server)
                .delete("/api/issues/test")
                .then(res=>{
                    assert.equal(res.status, 400);
                    assert.equal(res.text, "_id error", "returned error message is correct");
                    done();
                })
                .catch(err=>done(err));
        });

        test("Valid _id", function(done) {
            chai.request(server)
                .delete("/api/issues/test")
                .send({_id: "5cf8f0b0ebd0563a2c93f2e2"})
                .then(res=>{
                    assert.equal(res.status, 200);
                    assert.equal(res.text, "deleted 5cf8f0b0ebd0563a2c93f2e2", "return correct message");
                    done();
                })
                .catch(err=>done(err));
        });

    });

});
