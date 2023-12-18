require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { default: fetch } = require("node-fetch");
const jwt = require("jsonwebtoken");
const connectToMongoDB = require('./mongoConnect');
const PORT = process.env.PORT || 9000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//connect to mongoDB
connectToMongoDB();

//connect to socket.io
const createSocketConnection = require("./services/message.service");
const server = require("http").createServer(app);



// test route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//import routes
const routes = require('./routes/index.routes');
app.use(routes);
createSocketConnection(server);


app.listen(PORT, () => {
  console.log(`API server listening at http://localhost:${PORT}`);
});
