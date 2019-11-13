/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');

// not using
// var ObjectId = require('mongodb').ObjectID;

// needed for node to use .env file
// require('dotenv').config();

// using mongoose instead of MongoClient
var mongoose = require("mongoose");
var shortid = require("shortid");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// specify the shape of the data to be stored
var Issue = mongoose.model(
  "Issue",
  mongoose.Schema({
    _id: {
      type: String,
      default: shortid.generate
    },
    project_name: {
      type: String,
      required: true
    },
    issue_title: {
      type: String,
      required: true
    },
    issue_text: {
      type: String,
      required: true
    },
    created_by: {
      type: String,
      required: true
    },
    assigned_to: {
      type: String,
      default: ''
    },
    status_text: {
      type: String,
      default: ''
    },
    created_on: {
      type: Number,
      default: new Date().getTime()
    },
    updated_on: {
      type: Number,
      default: new Date().getTime()
    },
    open: {
      type: Boolean,
      default: true
    }
  })
);

var Project = mongoose.model(
  "Project",
  mongoose.Schema({
    project_name: {
      type: String,
      required: true
    },
    issues: { type: [], Issue: [Issue] }
  })
);
/* Issue.deleteMany({ project_name: 'AutoSampleProject' }, function (err, issue) {
console.log(issue.deletedCount)
}); */
/* Issue.exists({ project_name: 'AutoSampleProject' }).then(d => {
  if (d === false) {
    new Issue({
      project_name: 'AutoSampleProject',
      issue_title: 'Sample Issue 1',
      issue_text: 'This issue was auto generated',
      created_by: 'autoIssueGenerator',
      assigned_to: 'this field is not required',
      status_text: 'nor is this one'
    }).save(function (err, issue) {
      if (err) return console.error(err);
      console.log("Sample DB Created Just Now");
    })
  } else console.log("Sample DB Created Previously");
});

Issue.find({ project_name: 'AutoSampleProject' }).exec().then(d => console.log(d)); */

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')

    // this .get will not filter dates properly
    .get(function (req, res) {
      var project_name = req.params.project.replace(/%20/g, ' ');
      // console.log(project_name);
      console.log(`query: `, req.query);
      // var issues = [];
      var project = Project.findOne({ project_name: project_name }).exec().then(project => {
        // console.log(`project: `, project);
        if (project === null) return res.json([]);
        // filter for queries here
        // console.log(`query.open: `, typeof req.query.open);
        var issues = project.issues
          .filter(issue =>
            req.query.open === `${issue.open}` || req.query.open === undefined)
          .filter(issue =>
            req.query.issue_title === issue.issue_title || req.query.issue_title === undefined)
          .filter(issue =>
            req.query.issue_text === issue.issue_text || req.query.issue_text === undefined)
          .filter(issue =>
            req.query.created_by === issue.created_by || req.query.created_by === undefined)
          .filter(issue =>
            req.query.assigned_to === issue.assigned_to || req.query.assigned_to === undefined)
          .filter(issue =>
            req.query.status_text === issue.status_text || req.query.status_text === undefined);
        res.json(issues);
      });
    })

    .post(function (req, res) {
      var project_name = req.params.project.replace(/%20/g, ' ');
      console.log(`project_name: ${project_name}`);
      console.log(`req.body: `, req.body);
      /* if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) res.send("Please complete all required.");
      else { */
      // create a new issue  
      var issue = new Issue({
        // project_name: project_name,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || ''
      });
      console.log("Issue Created");
      // if no project, create project, else just push issue
      var project = Project.updateOne(
        { project_name: project_name },
        { $push: { issues: issue } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
        function (err, data) {
          if (err) return console.error(err);
          // console.log(`${data.project_name}, ${data.issues[0].issue_title} Created & Saved`);
        }
      );
      console.log("Project Created");
      // project.issues.push(issue);
      // project.update()

      res.json(issue);


      // new Project({ project_name: project });
      /* } */
    })

    .put(function (req, res) {
      var project_name = req.params.project.replace(/%20/g, ' ');
      var query = req.query;
      console.log(`query: `, query)

      Issue.updateOne({ _id: req.body._id }, { $set: { open: false }, updated_on: new Date().getTime() }, function (err, issue) {
        if (err) console.error(err);
        res.send('successfully updated');
      })
      //'This should always update updated_on. return successfully updated' or 'could not update '+_id or if no fields are sent return 'no updated field sent'.

    })

    .delete(function (req, res) {
      var project_name = req.params.project.replace(/%20/g, ' ');
      console.log(req.body)
      if (!req.body._id) res.send('_id error');
      Issue.deleteOne({ _id: req.body._id }, function (err, issue) {
        if (err) return console.error(err);
        console.log(issue.deletedCount);
        issue.deletedCount === 0
          ? res.send('could not delete ' + req.body._id)
          : res.send('deleted ' + req.body._id);
      });
    });

};
