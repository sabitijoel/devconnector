const express = require("express");
const mongoose = require("mongoose");
const gravatar = require("gravatar");
const bodyParser = require("body-parser");
const passport = require("passport");

const user = require("./routes/api/user");
const profile = require("./routes/api/profile");
const post = require("./routes/api/post");

const app = express();
//body perser middleware

app.use(bodyParser.urlencoded({ extended: false })); //what does this piece of code do
app.use(bodyParser.json());

//creating the db
const db = require("./config/keys").mongoURI;

//connecting the API we intend to create to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

//passport middleware

app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//use routes

app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/post", post);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port  ${port}`));
