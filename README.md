# Tipranks.com API

Fetches data from tipranks.com for a given stock ticker.

# Quick Start

```bash
$ npm install tipranks-api-v2
```

_index.js_
```javascript
const tipranksApi = require('tipranks-api-v2');

tipranksApi.getPriceTargets('MU').then(result => console.log(result));
```

```
{ symbol: 'MU',
  sentiment: { bullishPercent: 0.8, bearishPercent: 0.2 },
  buzz: { articlesInLastWeek: 10, weeklyAverage: 18.75, buzz: 0.5333 },
  sectorAverageBullishPercent: 0.6148,
  sectorAverageNewsScore: 0.5083,
  companyNewsScore: 0.722 }
```

```javascript
const tipranksApi = require('tipranks-api-v2');

tipranksApi.getNewsSentimentData('MU').then(result => console.log(result));
```

```
{ symbol: 'MU',
  priceTargets: 
   { mean: 83.28571428571429,
     median: 80,
     highest: 120,
     lowest: 60,
     numberOfEstimates: 21 } }
```