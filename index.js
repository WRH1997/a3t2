const express = require('express');
const fetch = require('node-fetch');
const app = express();
const ip = require('ip')
const parser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
var path = require('path');


/*var t = [];
fs.readdirSync("/").forEach(file => {
  t.push(file);
});
console.log(t);*/


app.use(parser.urlencoded({
  extended: true,
}))
app.use(parser.json());


app.post("/store-file", (request, res) => {
  var file = null;
  var data = null;
  try{
      //https://stackoverflow.com/questions/71815346/check-if-req-body-is-empty-doesnt-work-with-express
      if(Object.keys(request.body).length==0){
        res.json({"file": null, "error": "Invalid JSON input."});
        return;
    }
    data = request.body;
    if(!data.hasOwnProperty('file')){
        res.json({"file": null, "error":"Invalid JSON input."});
        return;
    }
    file = data['file'];
    if(file==null || file.trim()==''){
        res.json({"file": null, "error":"Invalid JSON input."});
        return;
    }
    fs.writeFileSync("/waleed_PV_dir/"+file, data['data']);
  }
  catch(e){
    response.json({"file": file, "error":"Error while storing the file to the storage.", "errMess":e});
    return;
  }
  res.json({"file":file, "message":"Success."});
})


app.post('/calculate', (request, res) => {
  /*let file = request.body['file'];
  let filePath = "/waleed_PV_dir/"+file;
  let exists = fileExists(filePath);
  let contents = null;
  if(exists){
    contents = fs.readFileSync(filePath, 'utf-8');
  }
  res.json({"exists?:": exists, "content":contents});*/
  var file = '';
  var prod = '';
  //https://stackoverflow.com/questions/71815346/check-if-req-body-is-empty-doesnt-work-with-express
  if(Object.keys(request.body).length==0){
      res.json({"file": null, "error": "Invalid JSON input."});
      return;
  }        
  var data = request.body;
  if(!data.hasOwnProperty('file')){
      res.json({"file": null, "error":"Invalid JSON input."});
      return;
  }
  if(data.hasOwnProperty('product')){
      prod = data['product'];
  }
  file = data['file'];
  var filePath = "/waleed_PV_dir/" + file;
  if(!fileExists(filePath)){
      res.json({"file":file, "error":"File not found."});
      return;
  }
  if(!validateCSV(filePath)){
      res.json({"file": file, "error":"Input file not in CSV format."});
      return;
  }
  var jsonObj = new Object();
  jsonObj.file = file;
  if(prod==''){
      jsonObj.prod = null;
  }
  else{
      jsonObj.prod = prod;
  }
  //console.log(prod+" "+data['product']+" "+jsonObj.prod);
  var userJson = JSON.parse(JSON.stringify(jsonObj));
  getSum(userJson).then((response) => {
      //console.log(response);
      res.json(response.data);
  })
})

app.get('/test', (req, res) => {
  //let ip1 = ip.address();
  fetch("http://34.172.108.163:5000/test", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"data":"someData", "dirs":t, "file":req.body['file']})
  }).then((ret) => {
    return ret.json();
  }).then((json)=>{
    //console.log(json);
    res.json(json);
  })
})


function fileExists(filePath){
  if(fs.existsSync(filePath)){
      return true;
  }
  else{
      return false;
  }
}

async function getSum(reqBody){
  var resp = await axios.post('http://34.172.108.163:5000/getSum', reqBody);
  return resp;
}

//!!!negsh from Cloud A1 (ref it?)
function validateCSV(filePath){
  var content = fs.readFileSync(filePath, 'utf-8');
  if(content.trim()==''){
      return false;
  }
  if(!content.includes(",")){
      return false;
  }
  var lines = content.split('\n');
  if(lines[0].trim().length==0){
      return false;
  }
  var headers = lines[0].trim().split(",");
  if(headers.length!=2 || headers[0].toLowerCase().trim()!='product' || headers[1].toLowerCase().trim()!='amount'){
      return false;
  }
  for(var x=0; x<lines.length; x++){
      if(x==0){
          continue;
      }
      var values = lines[x].trim().split(",");
      if(values.length!=2 || typeof values[0]!='string' || isNaN(values[1])){
          return false;
      }
  }
  return true;
}


const port = 6000;

//https://expressjs.com/en/starter/hello-world.html
app.listen(port, () => {
  console.log(`Server 1 started on ${ip.address()}:${port}`)
})
