// Main Modules Initialization
var http    = require('http');
var mysql   = require('mysql');
var express = require('express');
var app     = express();
var path    = require('path');
var qs      = require('querystring');

app.use("/public", express.static(path.join(__dirname, 'public')));


//Database Create Connection
var db = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'root',
   database : 'node_todo'
});

//Connection - Database
db.connect();

//Main route
app.get('/', function (req, res) {
   db.query('SELECT * FROM tasks ORDER BY created_at DESC', function(err, rows, fields) {
      if (err)  {
         res.status(503);
         res.render("error.ejs", {error : 503});  //503
      } else {
         res.render("index.ejs", {tasks: rows});
      }

   });
});
app.post('/addTask', function(request, res) { // Specifies which URL to listen for
   if (request.method == 'POST') {
      var body = '';
      request.on('data', function (data) {
         body += data;
         // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
         if (body.length > 1e6) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            request.connection.destroy();
         }
      });
      request.on('end', function () {
         var task = qs.parse(body);
         // use POST
         task = task.taskAdded;

         var d = new Date().toISOString().slice(0, 19).replace('T', ' ');
         var sql = "INSERT INTO tasks (task, status, created_at) VALUES ('"+task+"', '0', '"+d+"' )";
         var values = [
            ['task', task, 1],
            ['status', 0, 1],
            ['created_at', d, 3],
         ];

         db.query(sql, function (err, rows, fields) {
            if (err) {
               res.status(503);
               res.render("error.ejs", {error : 503});  //503
            } else {
               db.query('SELECT * FROM tasks ORDER BY created_at DESC', function(err, rows, fields) {
                  if (err)  {
                     res.status(503);
                     res.render("error.ejs", {error : 503});  //503
                  } else {
                    res.render("index.ejs", {tasks: rows});
                  }

               });
            }
         });

      });
   }
});

app.post('/deleteTask', function(request, res) { // Specifies which URL to listen for
   if (request.method == 'POST') {
      var body = '';
      request.on('data', function (data) {
         body += data;
         // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
         if (body.length > 1e6) {
            // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
            request.connection.destroy();
         }
      });
      request.on('end', function () {
         //Recup data
         var task = qs.parse(body);
         //POST
         var id  = task.idDel;
         //SQL Request
         var sql = "DELETE FROM tasks WHERE id ="+id;
         db.query(sql, function (err, rows, fields) {
            if (err) {
               res.status(503);
               res.render("error.ejs", {error : 503});  //503
            } else {
               db.query('SELECT * FROM tasks ORDER BY created_at DESC', function(err, rows, fields) {
                  if (err)  {
                     res.status(503);
                     res.render("error.ejs", {error : 503});  //503
                  } else {
                     res.render("index.ejs", {tasks: rows});
                  }
               });
            }
         });
      });
   }
});

//Any other route
app.get('*', function(req, res){
   res.status(404);
   res.render("error.ejs", {error : 404}); //404
});

app.listen(8181);