///utils
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
///

const fs = require('fs')
const express = require('express')
const app = express();
const path = require('path');
const { Pool } = require('pg')
const cookieParser = require('cookie-parser')

const PORT = 5001;
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/postgres'

const pool = new Pool({
  connectionString: connectionString,
  ssl: false
})
pool.connect();

app.use(cookieParser())

app.get('/', function(req, res) {
  console.log('Client on index!')
  //console.log(req.cookies)
  //let que = "SELECT * FROM users where username='" + user + "' AND userpw='" + pw + "';"
  res.sendFile(path.join(__dirname, '/index.html'))
  
});
app.get('/mainScript.js', function(req, res) {
  res.sendFile(path.join(__dirname, '/mainScript.js'))
});
app.get('/reg', function(req, res) {
  console.log("/reg", req.query.login, req.query.pw, req.query.blanc)
  let que = `INSERT INTO users(userName, userMail, userPW, userAbout) 
  VALUES($1, $2, $3, $4);`
  let values = [req.query.login, "nomail@nonono.com", req.query.pw, "test user"]
  pool.query(que, values).then(res1 => {
    res.send('ok')
  });
})
app.get('/getAllUsers', function(req, res) {
  //show this into the screen list
  pool.query('SELECT * FROM users;')
  .then(res1 => {
    res.send(res1.rows)
  })
  .catch(e => console.error(e.stack))
})
app.get('/logout', function(req, res) {
  res.cookie('state', '', {expires: new Date(0)});
  res.end()
  console.log('logout')
  //need to delete more cookies
  //also need to send back that app state should update
})

app.get('/login', function(req, res) {
  console.log("/login")
  user = req.query.login
  pw = req.query.pw
  //pool.query('SELECT * FROM users where username=' + user + ' AND userpw=' + pw +';')
  let que = "SELECT * FROM users where username='" + user + "' AND userpw='" + pw + "';"
  pool.query(que)
  .then(res1 => {
    if (res1.rows.length>0) {
      let tmpId = makeid()
      //res.cookie('cookie', tmpId)
      //res.cookie('uId', res1.rows[0].userid)
      //console.log('!!' + res1.rows[0])
      let que2 = "update users set currentcookie = '" + tmpId + "' where userid='" + res1.rows[0].userid + "';"
      //console.log("que: " + que2)
      pool.query(que2)
      delete res1.rows[0].currentcookie
      delete res1.rows[0].userpw
      delete res1.rows[0].lastloggedin
      res.cookie('state', JSON.stringify(res1.rows[0]))
      res.status(200).send(res1.rows[0])//redo this line
      console.log(res1.rows)
      //dont send the object, set the cookies and send state change!     
    }
    else {
      res.status(201).send('loginus is wrongus')
      
    }
  })
  .catch(e => console.error(e.stack))
})


app.listen(PORT);