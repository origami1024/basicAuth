const fs = require('fs')
const express = require('express')
const app = express();
const path = require('path');
const { Pool } = require('pg')


const PORT = 5001;
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/postgres'

const pool = new Pool({
  connectionString: connectionString,
  ssl: false
})
pool.connect();


app.get('/', function(req, res) {
  console.log('Client on index!')
  res.sendFile(path.join(__dirname, '/index.html'))
});
app.listen(PORT);