const axios = require('axios');
const express = require('express')
const hbs = require('hbs');

const app = express()
const port = 3000;

app.set('views', __dirname + '/views') // specify the views directory
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + "/views/partials"); 

app.use(express.static('public'))

let btcPrice;

app.get('/trending', (req, res) => { // Trending route
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    .then(btcData =>{
        btcPrice = btcData.data.bitcoin.usd
    })
    
    axios.get('https://api.coingecko.com/api/v3/search/trending')
    .then(apiData =>{
        
        let trendingCoins = apiData.data.coins
        for (i=0;i<trendingCoins.length;i++){
            trendingCoins[i].item.price_btc *=  btcPrice
            trendingCoins[i].item.price_btc = trendingCoins[i].item.price_btc.toFixed(3)
        }
        
        res.render('trending', {trendingCoins})
    })
})
let globalStats;
app.get('/', (req, res) => { // Homepage route
    axios.get('https://api.coingecko.com/api/v3/global')
    .then(apiData =>{
         globalStats = apiData.data
         globalStats.data.market_cap_change_percentage_24h_usd = globalStats.data.market_cap_change_percentage_24h_usd.toLocaleString('en-US', {maximumFractionDigits:2})
    })

    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false')
    .then(coinsData =>{
        let coinsArray = coinsData.data
        for (i=0;i<coinsArray.length;i++){
            coinsArray[i].market_cap = coinsArray[i].market_cap.toLocaleString('en-US');
            coinsArray[i].current_price = coinsArray[i].current_price.toLocaleString('en-US', {maximumFractionDigits:2});
            coinsArray[i].symbol = coinsArray[i].symbol.toUpperCase();
            coinsArray[i].price_change_percentage_24h =  coinsArray[i].price_change_percentage_24h.toLocaleString('en-US', {maximumFractionDigits:2});
            coinsArray[i].ath = coinsArray[i].ath.toLocaleString('en-US', {maximumFractionDigits:2})
        }
        res.render('index', {coinsArray, globalStats})
    })
        
})
let globalStats2;

app.get('/global', (req,res)=>{
    axios.get('https://api.coingecko.com/api/v3/global')
    .then(apiData =>{
         globalStats2 = apiData.data
         console.log(globalStats2)
         globalStats2.data.market_cap_change_percentage_24h_usd = globalStats2.data.market_cap_change_percentage_24h_usd.toLocaleString('en-US', {maximumFractionDigits:2})
         let marketCapArray = globalStats2.data.total_market_cap;
         globalStats2.data.active_cryptocurrencies = globalStats2.data.active_cryptocurrencies.toLocaleString('en-US');

         let counter=0;
         for(const property in marketCapArray){
            counter += marketCapArray[property];
            console.log(counter)
         }
         counter = counter.toLocaleString('en-US', {maximumFractionDigits:2})
         res.render('global', {globalStats2, counter})
    })
    
})



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})