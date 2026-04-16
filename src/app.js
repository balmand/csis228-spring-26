const express = require("express");
const path = require('path');
const clientRoutes = require("./routes/client.routes");
const clientRoutesV2 = require("./routes/client.routes.v2");
const departmentRoutes = require("./routes/department.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
// Backwards-compatible alias (older tests/docs used /api/auth)
app.use("/api/auth", authRoutes);
app.use("/api/v1/clients", clientRoutes);
app.use("/api/v2/clients", clientRoutesV2);
app.use("/api/dep", departmentRoutes);

// Set views folder
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

app.get('/homepage', (req, res) =>{
    res.render('home', 
        {
            title: 'Home page 123',
            users: [{name: "test1"}, {name: "test2"}]
        }
    );
})

app.get('/aboutus', (req, res) =>{
    res.render('about');
})

app.get("/api/hello", (req, res) =>{
    res.json({message: "hello world"});
});

app.post('/api/user', (req, res) => {
    res.status(201).json({name: "John"});
});

module.exports = app;
