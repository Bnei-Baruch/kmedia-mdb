#!/usr/bin/env node

const http = require('http');

const server = http.createServer((req, res) => {
  console.log(req.query);
});

server.listen(9876, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Serving local locales.');
  }
});
