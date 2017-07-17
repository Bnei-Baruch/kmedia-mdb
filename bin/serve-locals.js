#!/usr/bin/env node
require('dotenv').config();

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = process.env.REACT_APP_LOCALES_BACKEND_PORT || 80;

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  const filePath = path.join(__dirname, '..', pathname);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  readStream.on('close', () => res.end());
  readStream.pipe(res);
});

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Serving locales.');
  }
});
