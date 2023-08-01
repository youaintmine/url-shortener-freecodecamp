require('dotenv').config();
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let urlList = [];


app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl/:id?', (req, res) => {

  const id = req.params.id;

  if(id){
    //check
    if(id < urlList.length()){
      return res.json({
        error: 'invalid url'
      });
    }else {
      const url = urlList[id-1];
      return res.redirect(url);
    }
  }


  const inputUrl = req.body['url'];

  dns.lookup(inputUrl, (err, address, family) => {
    if(err){
      return res.json({ error: 'invalid url' });
    }else{
      urlList.push(inputUrl);
      return res.json({
        original_url : inputUrl,
        short_url : urlList.length()
      });
    }
  });
  
});

app.get('/api/shorturl/:')

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
