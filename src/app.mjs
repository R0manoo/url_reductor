import morgan from "morgan";
import express from "express";
import bodyParser from "body-parser";
//A changer lors du déploiment sur le web

// const host = process.env.HOST || "localhost";
// const host = '0.0.0.0';
const port = process.env.PORT || 3000;
const app = express();
const environment = app.get("env");

//* ACTIVATING MORGAN WHEN USING DEV
console.log(environment);
if (environment === "development") {
    app.use(morgan("dev"));
}

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let storedUrl = [
];

function generateRandomRoute(len) {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let isUnique = false;
    let result = "";
    while (!isUnique) {
        result = "";
        //* CREATE A RANDOM STRING
        for (let i = 0; i < len; i++) {
            result += characters.charAt(Math.random() * characters.length);
        }
        //* IF STRING EXIST WE LOOP AGAIN 'TILL WE GOOD
        if (!storedUrl.some((obj) => obj.shortUrl === result)) {
            return result;
        }
    }
}

app.post("/local-storage", async (req, res) => {
    // console.log(`Before :${storedUrl}`);
    for (const elem of req.body) {
        storedUrl.push(elem);
    }
    // console.log(`After :${storedUrl}`);
    res.sendStatus(201);
});

app.get("/local-storage", (req, res) => {
    res.send(storedUrl);
});

app.post("/submit", (req, res) => {
    const url = req.body.url;
    const length = req.body.length;
    const shortUrl = generateRandomRoute(length);
    storedUrl.push({
        url: url,
        shortUrl: shortUrl,
    });
    res.sendStatus(201);
});

app.get("/submit", async (req, res) => {
    console.log(req.length)
    res.send(storedUrl);
});

/*
*CETE fonction va checker si url entré par user correspond à un présent dans la liste d'url
! PEUT PTET GENERER DES ERREURS
*/
app.get("/*", async (req, res) => {
    // const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    for (const elem of storedUrl) {
        if (req.originalUrl === `/${elem.shortUrl}`) {
            return res
                .writeHead(301, {
                    Location: elem.url,
                })
                .end();
        }
    }
    //TODO SEND A ERROR FILE HERE MAYBE
    res.send(`NO MATCH FOR ${req.originalUrl}`);
});


app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
});