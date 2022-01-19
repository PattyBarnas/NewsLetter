const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true }));

app.use(express.static("public"));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
  const firstName = req.body.inputFirstName;
  const lastName = req.body.inputLastName;
  const email = req.body.inputEmail;
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us20.api.mailchimp.com/3.0/lists/c0e75f22f8";

  const options = {
    method: "POST",
    auth: "pbarnas:51dc43058a0035a2a18478ade1ee73b4-us20"
  }

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/")
});




app.listen(process.env.PORT || 3000, function(){
  console.log("server 3000 is running");
});

// API KEY: 51dc43058a0035a2a18478ade1ee73b4-us20
// AUDIENCE ID: c0e75f22f8
