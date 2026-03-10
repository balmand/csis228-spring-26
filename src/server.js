require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`SERVER running on http://localhost:${PORT}`);
})