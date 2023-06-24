const express = require('express')
const userRoute = require("./routes/Users");
const pinRoute = require("./routes/Pins");
const sequelize = require("./config/database");

const app = express()


app.use(express.json());



sequelize
  .authenticate()
  .then(() => {
    console.log("PostgreSQL connected!");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.listen(8080,()=>{
    console.log("Backend Server is running!")
})