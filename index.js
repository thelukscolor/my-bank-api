const express = require("express");
const fs = require("fs");
const accountsRouter = require("./routes/accounts");
const app = express();
app.use(express.json());

global.file = "accounts.json";

app.use("/account", accountsRouter);

app.listen(3000, () => {
    try {
        fs.readFile(global.file, "utf8", (err, data) => {
            if (err) {
                const initialJson = {
                    nextId: 1,
                    accounts: [],
                };
                fs.writeFile(
                    global.file,
                    JSON.stringify(initialJson),
                    (err) => {
                        console.log(err);
                    }
                );
            }
        });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
    console.log("Start aplication!");
});
