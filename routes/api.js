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
require('dotenv').config();

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

Issue.exists({ project_name: 'Auto Sample Project' }).then(d => {
  if (d === false) {
    new Issue({
      project_name: 'Auto Sample Project',
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

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get(function (req, res) {
      var project = req.params.project;


    })

    .post(function (req, res) {
      var project = req.params.project;

    })

    .put(function (req, res) {
      var project = req.params.project;

    })

    .delete(function (req, res) {
      var project = req.params.project;

    });

};
