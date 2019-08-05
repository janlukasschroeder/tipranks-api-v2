# Tipranks.com API

For any company (e.g. Tesla) the API returns

- price targets calculated from analyst estimates: mean, median, highest, lowest, number of estimates
- news sentiment data (bullish vs bearish) based on published articles in the last week

It also returns trending stocks.

# Examples

## Tesla Price Targets

```json
{
  "symbol": "TSLA",
  "priceTargets": {
    "mean": 297.3333333333333,
    "median": 300,
    "highest": 500,
    "lowest": 54,
    "numberOfEstimates": 21
  }
}
```

## Tesla News Sentiment

```json
{
  "symbol": "TSLA",
  "sentiment": {
    "bullishPercent": 0.4062,
    "bearishPercent": 0.5938
  },
  "buzz": {
    "articlesInLastWeek": 143,
    "weeklyAverage": 147.25,
    "buzz": 0.9711
  },
  "sectorAverageBullishPercent": 0.6204,
  "sectorAverageNewsScore": 0.52,
  "companyNewsScore": 0.3969
}
```

## Trending Stocks

```json
[
  {
    "ticker": "HAL",
    "popularity": 10,
    "sentiment": 10,
    "consensusScore": 1,
    "operations": null,
    "sector": "BASIC MATERIALS",
    "sectorID": 17343,
    "marketCap": 18394572000,
    "buy": 10,
    "sell": 0,
    "hold": 0,
    "priceTarget": 32.42,
    "rating": 5,
    "companyName": "Halliburton",
    "quarterlyTrend": 5,
    "lastRatingDate": "2019-07-24T00:00:00"
  },
  {
    "ticker": "XLNX",
    "popularity": 9,
    "sentiment": 6,
    "consensusScore": 1.6666666666666667,
    "operations": null,
    "sector": "CONSUMER GOODS",
    "sectorID": 18731,
    "marketCap": 27832018900,
    "buy": 6,
    "sell": 0,
    "hold": 3,
    "priceTarget": 131.6,
    "rating": 4,
    "companyName": "Xilinx Inc",
    "quarterlyTrend": 4,
    "lastRatingDate": "2019-07-26T00:00:00"
  }
]
```

# Setup

- Install Node.js (which includes `npm`) if you haven't already. On Mac in the command line type `brew install node`. More information here: [nodejs.org](https://nodejs.org/en)
- Set up a new Node.js project. In the command line type
  - `mkdir my-new-project && cd my-new-project` to create a new folder
  - `npm init` to scaffold the Node.js project
  - `touch index.js` to create the file `index.js`
  - `npm install tipranks-api-v2` to install the library to access the API
  - Copy/paste the example code below inside the `index.js` file

```js
const tipranksApi = require('tipranks-api-v2');
tipranksApi.getPriceTargets('MU').then(result => console.log(result));
tipranksApi.getNewsSentimentData('MU').then(result => console.log(result));
tipranksApi.getTrendingStocks().then(trending => console.log(trending));
```

- `node index.js` to run the code inside the `index.js` file
- Done! Now you should see the price targets and the news sentiment for the ticker `MU`

# Documentation

The API supports the following commands:

- `.getPriceTargets(ticker)`
  - `ticker` is a string representing the company ticker, e.g. `TSLA`.
  - This method returns the mean price target, median target,
    highest target, lowest target, and the number of analyst estimates. See
    below for an example.

_Note:_ The price calculator (e.g. mean price) only considers analyst price
estimates given in the last 3 months.
The API intentionally excludes estimates given more than three months ago
as analysts seem to review/update their estimates in a quarterly interval.
The result: under "Analyst ratings" on the website the "average price" for MU was 46.5
and the script displayed 46.77 for "mean" price.

- `.getNewsSentimentData(ticker)`

  - `ticker` is a string representing the company ticker, e.g. `TSLA`.
  - This method returns the bullish and bearish sentiment in percent,
    the number of articles published last week, sector average bullish
    percent, sector average news score, and the company's news score. See
    example below.

- `.getTrendingStocks()`
  - Returns an array of trending stocks listed on [tipranks.com/trending-stocks](https://www.tipranks.com/trending-stocks)

# Examples

## Get Price Targets: `getPriceTargets`

### index.js File

- Copy the code below into the `index.js` file
- `node index.js` to run the code

```javascript
const tipranksApi = require('tipranks-api-v2');

tipranksApi.getPriceTargets('TSLA').then(result => console.log(result));
```

### Output

```json
{
  "symbol": "TSLA",
  "priceTargets": {
    "mean": 297.3333333333333,
    "median": 300,
    "highest": 500,
    "lowest": 54,
    "numberOfEstimates": 21
  }
}
```

## Get News Sentiment: `getNewsSentimentData`

### index.js File

- Copy the code below into the `index.js` file
- `node index.js` to run the code

```javascript
const tipranksApi = require('tipranks-api-v2');

tipranksApi.getNewsSentimentData('TSLA').then(result => console.log(result));
```

### Output

```json
{
  "symbol": "TSLA",
  "sentiment": {
    "bullishPercent": 0.4062,
    "bearishPercent": 0.5938
  },
  "buzz": {
    "articlesInLastWeek": 143,
    "weeklyAverage": 147.25,
    "buzz": 0.9711
  },
  "sectorAverageBullishPercent": 0.6204,
  "sectorAverageNewsScore": 0.52,
  "companyNewsScore": 0.3969
}
```
