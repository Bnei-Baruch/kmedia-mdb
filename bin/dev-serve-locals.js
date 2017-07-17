#!/usr/bin/env node

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;
  console.log(path.resolve(__dirname));
  const filePath = path.join(__dirname, '..', pathname);
  console.log(filePath);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  readStream.on('close', () => res.end());
  readStream.pipe(res);
});

server.listen(9876, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Serving local locales.');
  }
});
