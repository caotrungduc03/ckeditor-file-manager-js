const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const browser = require('ckeditor-file-manager-js');
const skipper = require('skipper');

const index = require('./routes/index');

const app = express();
const port = 8080;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.all('/browser/browse', skipper(), browser.browse);
app.post('/uploader/upload', skipper(), browser.upload);
app.use('/', index);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
