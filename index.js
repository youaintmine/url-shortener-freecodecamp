require('dotenv').config();
const dns = require('dns');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const urlparser = require('url')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let urlList = [];


app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',async (req, res) => {

  const url = req.body.url;
  const dnslookup = dns.lookup(urlparser.parse(url).hostname, 
  async (err, address) => {
    if(!address){
      res.json({error : "Invalid URL"})
    }else {
      urlList.push(url);
      console.log(urlList);
      res.json({
        original_url : url,
        short_url : urlList.length
      })
    }
  })
});

app.get('/api/shorturl/:idx', async (req,res) => {
  console.log(req.params.idx);

  const idx = req.params.idx;

  if(idx <= urlList.length){
    return res.redirect(urlList.at(idx-1));
  }
  return res.json({ error: 'invalid url' });
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
