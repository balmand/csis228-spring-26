const express = require("express");
const clientRoutes = require("./routes/client.routes");
const clientRoutesV2 = require("./routes/client.routes.v2");
const departmentRoutes = require("./routes/department.routes");

const app = express();

app.use(express.json());
app.use("/api/v1/clients", clientRoutes);
app.use("/api/v2/clients", clientRoutesV2);
app.use("/api/dep", departmentRoutes);

app.get("/api/hello", (req, res) =>{
    res.json({message: "hello world"});
});

app.post('/api/user', (req, res) => {
    res.status(201).json({name: "John"});
});

module.exports = app;
