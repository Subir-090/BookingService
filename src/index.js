const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig');

function setUpAndStartServer() {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));

    app.listen(PORT, () => {
        console.log(`Server started at ${PORT}`);
    });
}

setUpAndStartServer();