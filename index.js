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

  const fullUrl = req.body['url'].toString();
  var inputUrl;
  console.log(fullUrl);

  if(fullUrl.substr(0,8)==="https://"){
    inputUrl = fullUrl.substr(8);
  }else if(fullUrl.substr(0,7)==="http://"){
    inputUrl = fullUrl.substr(7);
  }else {
    return res.json({ error: 'invalid url' });
  }

  console.log(inputUrl);

  await dns.lookup(inputUrl, (err, address, family) => {
    if(err){
      return res.json({ error: 'invalid url' });
    }else{
      console.log(`address : ${address} \n family : ${family}`);
      console.log(urlList);
      urlList.push(fullUrl);
      return res.json({
        original_url : fullUrl,
        short_url : urlList.length
      });
    }
  });
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
