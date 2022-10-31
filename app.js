const axios = require('axios');
const express = require('express')
const hbs = require('hbs');

const app = express()
const port = 3000;

app.set('views', __dirname + '/views') // specify the views directory
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials"); 

app.use(express.static('public'))


app.get('/trending', (req, res) => { // Trending route
    
    axios.get('https://api.coingecko.com/api/v3/search/trending')
    .then(apiData =>{
        let trendingCoins = apiData.data.coins
        res.render('trending', {trendingCoins: trendingCoins})
    })
})

app.get('/', (req, res) => { // Homepage route
        res.render('index')
    })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })