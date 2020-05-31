const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

app.post("/account", (req, res) => {
    let account = req.body;

    fs.readFile("accounts.json", "utf8", (err, data) => {
        if (!err) {
            try {
                let json = JSON.parse(data);
                account =  { id: json.nextId++, ...account};
                json.accounts.push(account);

                fs.writeFile("accounts.json", JSON.stringify(json), (err) => {
                    if (err) {
                        res.status(400).send({error: err.message});
                    } else {
                        res.end();
                    }
                })
                console.log(json);
            } catch {
                res.status(400).send({error: err.message});
            }
        } else {
            res.status(400).send({error: err.message});
        }
    });
    res.json({ return: "ok" });
});

app.listen(3000, () => {
    try {
        fs.readFile("accounts.json", "utf8", (err, data) => {
            if (err) {
                const initialJson = {
                    nextId: 1,
                    accounts: [],
                };
                fs.writeFile(
                    "accounts.json",
                    JSON.stringify(initialJson),
                    (err) => {
                        console.log(err);
                    }
                );
            }
        });
    } catch (err) {
        res.status(400).send({error: err.message});
    }
    console.log("Start aplication!");
});
