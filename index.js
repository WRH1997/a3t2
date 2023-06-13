const express = require('express');
const fetch = require('node-fetch');
const app = express();
const ip = require('ip')
const parser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
var path = require('path');

app.use(parser.urlencoded({
  extended: true,
}))
app.use(parser.json());


app.get('/test', (req, res) => {
  let ip1 = ip.address();
  fetch("http://34.31.204.43:5000/incoming", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"data":"someData"})
  }).then((ret) => {
    return ret.json();
  }).then((json)=>{
    //console.log(json);
    res.json(json);
  })
  //res.json({'data':'YYYsomeData', "req":req.body, "ip":ip1});
})


const port = 6000;

//https://expressjs.com/en/starter/hello-world.html
app.listen(port, () => {
  console.log(`Server 1 started on ${ip.address()}:${port}`)
})
