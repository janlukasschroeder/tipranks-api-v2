# Tipranks.com API

- Fetches data from tipranks.com for a given stock ticker.
- You need to install Node.js to use the package (see tutorial below)

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
```
  - `node index.js` to run the code inside the `index.js` file
  - Done! Now you should see the price targets and the news sentiment for the ticker `MU`

# Documentation
The API supports the following commands:

- `getPriceTargets(ticker)`
  - `ticker` is a string representing the company ticker, e.g. `TSLA`.
  - This method returns the mean price target, median target,
highest target, lowest target, and the number of analyst estimates. See
below for an example.

- `getNewsSentimentData(ticker)`
  - `ticker` is a string representing the company ticker, e.g. `TSLA`.
  - This method returns the bullish and bearish sentiment in percent,
  the number of articles published last week, sector average bullish
  percent, sector average news score, and the company's news score. See
  example below.

# Examples

## Get Price Targets: `getPriceTargets`

### index.js File
- Copy the code below into the `index.js` file
- `node index.js` to run the code

```javascript
const tipranksApi = require('tipranks-api-v2');

tipranksApi.getPriceTargets('MU').then(result => console.log(result));
```

### Output
```
{ symbol: 'MU',
  priceTargets: 
   { mean: 83.28571428571429,
     median: 80,
     highest: 120,
     lowest: 60,
     numberOfEstimates: 21 } }
```

## Get News Sentiment: `getNewsSentimentData`

### index.js File
- Copy the code below into the `index.js` file
- `node index.js` to run the code

```javascript
const tipranksApi = require('tipranks-api-v2');

tipranksApi.getNewsSentimentData('MU').then(result => console.log(result));
```

### Output
```
{ symbol: 'MU',
  sentiment: { bullishPercent: 0.8, bearishPercent: 0.2 },
  buzz: { articlesInLastWeek: 10, weeklyAverage: 18.75, buzz: 0.5333 },
  sectorAverageBullishPercent: 0.6148,
  sectorAverageNewsScore: 0.5083,
  companyNewsScore: 0.722 }
```