const express = require("express");
const router = express.Router();
const fs = require("fs");

router.delete("/:id", (req, res) =>{
    fs.readFile(global.file, "utf8", (err, data) => {
        try {
            if (err) {
                throw err;
            }
            let json = JSON.parse(data);
            const accounts = json.accounts.filter(
                (account) => account.id != req.params.id
            );
            json.accounts = accounts;

            fs.writeFile(global.file, JSON.stringify(json), err => {
                if (err) {
                    res.status(400).json({ erro: err.message });
                } else {
                    res.end();
                }
            })
        } catch (err) {
            res.status(400).json({ erro: err.message });
        }
    });
})

router.put("/", (req, res) => {
    let newAccount = req.body;
    fs.readFile(global.file, "utf8", (err, data) => {
        try {
            if (err) {
                throw err;
            }
            let json = JSON.parse(data);
            let oldIndex = json.accounts.findIndex(account => account.id == newAccount.id);
            json.accounts[oldIndex] = newAccount;

            fs.writeFile(global.file, JSON.stringify(json), (err) => {
                if (err) {
                    res.status(400).send({ error: err.message });
                } else {
                    res.end();
                }
            });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    });
});

router.post("/", (req, res) => {
    let account = req.body;
    fs.readFile(global.file, "utf8", (err, data) => {
        try {
            if (err) {
                throw err;
            }

            let json = JSON.parse(data);
            account = { id: json.nextId++, ...account };
            json.accounts.push(account);

            fs.writeFile(global.file, JSON.stringify(json), (err) => {
                if (err) {
                    res.status(400).send({ error: err.message });
                } else {
                    res.end();
                }
            });
        } catch (err) {
            res.status(400).send({ error: err.message });
        }
    });
});

router.get("/", (_, res) => {
    fs.readFile(global.file, "utf8", (err, data) => {
        if (err) throw err;
        try {
            let json = JSON.parse(data);
            delete json.nextId;
            res.send(json);
        } catch (error) {
            res.status(400).json({ erro: err.message });
        }
    });
});

router.get("/:id", (req, res) => {
    fs.readFile(global.file, "utf8", (err, data) => {
        try {
            if (err) {
                throw err;
            }
            let json = JSON.parse(data);
            const account = json.accounts.find(
                (account) => account.id == req.params.id
            );
            if (account) {
                res.send(account);
            } else {
                res.end();
            }
        } catch (err) {
            res.status(400).json({ erro: err.message });
        }
    });
});

module.exports = router;
