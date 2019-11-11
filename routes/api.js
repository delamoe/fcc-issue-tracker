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
      // console.log(project);
      // console.log(req.query);
      var project = req.params.project;
      Issue.find({ project_name: project }).find(req.query).exec().then(d => res.json(d));
    })

    .post(function (req, res) {
      // console.log(project);
      // console.log(req.body);
      /* if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) res.send("Please complete all required.");
      else { */
      new Issue({
        project_name: req.params.project.replace('%20', ' '),
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      }).save(function (err, issue) {
        if (err) return console.error(err);
        // console.log(`${issue.project_name}, ${issue.issue_title} Created & Saved`);
        res.json(issue);
      })
      /* } */
    })

    .put(function (req, res) {
      var project = req.params.project;

    })

    .delete(function (req, res) {
      console.log(req.body)
      if (!req.body._id) res.send('_id error');
      Issue.deleteOne({ _id: req.body._id }, function (err, issue) {
        if (err) return console.error(err);
        console.log(issue.deletedCount);
        issue.deletedCount === 0
          ? res.send('could not delete ' + _id)
          : res.send('deleted ' + _id);
      });
    });

};
