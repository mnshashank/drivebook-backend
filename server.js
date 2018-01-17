var express = require('express'),
    schools = require('./routes/school'),
    logger = require('morgan');
var MongoClient = require('mongodb').MongoClient,
                  assert = require('assert');

var app = express();


app.use(logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(express.json());

MongoClient.connect('mongodb://localhost:27017/learn', function(err, database) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    const datab = database.db('learn');

    app.get('/schools', function(req, res) {
      var schoolList = {"name" : 1,"rating": 1,"image": 1};
      datab.collection('school', function(err, collection) {
          collection.find().project(schoolList).toArray(function(err, items) {
              res.header("Access-Control-Allow-Origin", "*");
              res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
              res.send(items);
          });
      });
    });

    app.get('/schools/:id', function(req, res) {
      var id = req.params.id;
      console.log('Retrieving school: ' + id);
      datab.collection('school', function(err, collection) {
          collection.find({'_id':id}).limit(1).next(function(err, item) {
              res.header("Access-Control-Allow-Origin", "*");
              res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
              res.send(item);
          });
      });
    });

    app.post('/schools', function(req, res) {
      var school = req.body;
      console.log('Adding school: ' + JSON.stringify(school));
      db.collection('school', function(err, collection) {
          collection.insert(school, {safe:true}, function(err, result) {
              if (err) {
                  res.send({'error':'An error has occurred'});
              } else {
                  console.log('Success: ' + JSON.stringify(result[0]));
                  res.send(result[0]);
              }
          });
      });
    });

    app.put('/schools/:id', function(req, res) {
      var id = req.params.id;
      var school = req.body;
      console.log('Updating school: ' + id);
      console.log(JSON.stringify(school));
      db.collection('school', function(err, collection) {
          collection.update({'_id':id}, school, {safe:true}, function(err, result) {
              if (err) {
                  console.log('Error updating wine: ' + err);
                  res.send({'error':'An error has occurred'});
              } else {
                  console.log('' + result + ' document(s) updated');
                  res.send(wine);
              }
          });
      });
    });

    app.delete('/schools/:id', function(req, res) {
      var id = req.params.id;
      console.log('Deleting school: ' + id);
      db.collection('school', function(err, collection) {
          collection.remove({'_id':id}, {safe:true}, function(err, result) {
              if (err) {
                  res.send({'error':'An error has occurred - ' + err});
              } else {
                  console.log('' + result + ' document(s) deleted');
                  res.send(req.body);
              }
          });
      });
    });

    app.listen(3000);
    console.log('Listening on port 3000...');
});
