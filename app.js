const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
// const { log } = require("console");

const app = express();
app.use(bodyparser.urlencoded({ extended: true }));

app.use(
  express.static("public")
); /*******Used to access static coomponents of webpage*********/

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us21.api.mailchimp.com/3.0/lists/170a9b2a21";
  const options = {
    method: "POST",
    auth: "parth:b5a16946dd4bcfe9c3a5fa445aa497c2-us21",
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
app.listen(process.env.PORT || 3000, function () {
  console.log("Server Running");
});

// API-Key : b5a16946dd4bcfe9c3a5fa445aa497c2-us21
//List-id : 170a9b2a21
