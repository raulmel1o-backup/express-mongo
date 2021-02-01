const express = require('express');
const cors = require('cors');

const app = express();

const allowedList = ['http://localhost:3000', 'http://localhost:3000'];

const corsOptionsDelegate = (req, cb) => {

    let corsOptions;

    if (allowedList.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }

    cb(null, corsOptions);

};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);