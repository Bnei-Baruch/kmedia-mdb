module.exports = {
  "env"          : {
    "es6"    : true
  },
  "extends"      : "eslint:recommended",
  "parser"       : "babel-eslint",
  "parserOptions": {
    "ecmaVersion" : 7,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx"                         : true
    },
    "sourceType"  : "module"
  },
  "plugins"      : [
    "react"
  ],
  "rules"        : {
    "strict"         : 0,
    "indent"         : [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes"         : [
      "error",
      "single"
    ],
    "semi"           : [
      "error",
      "always"
    ]
  }
};
