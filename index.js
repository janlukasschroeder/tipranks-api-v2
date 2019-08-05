#!/usr/bin/env node

const h = require('./helpers');
const config = require('./config');
const moment = require('moment');

/**
 *
 * @param symbol
 * @returns {Promise.<TResult>}
 */
module.exports.getNewsSentimentData = symbol => {
  const timestamp = moment().unix();
  const query =
    config.tipranks.baseUrl +
    `getNewsSentiments/?ticker=${symbol.toLowerCase()}&break=${timestamp}`;

  return h.fetch(query).then(result => {
    return formatNewsSentiment(result);
  });
};

/**
 * Get price targets of symbol
 * @param symbol
 * @returns {Promise.<TResult>}
 */
module.exports.getPriceTargets = symbol => {
  const timestamp = moment().unix();
  const query =
    config.tipranks.baseUrl +
    `getData/?name=${symbol.toLowerCase()}&benchmark=1&period=3&break=${timestamp}`;

  return h.fetch(query).then(result => {
    return formatPriceTargets(result);
  });
};

/**
 * Get trending stocks from https://www.tipranks.com/trending-stocks
 * @returns {Promise}
 */
module.exports.getTrendingStocks = () => {
  const timestamp = moment().unix();
  const query =
    config.tipranks.baseUrl +
    `gettrendingstocks/?daysago=30&which=most&break=${timestamp}`;
  return h.fetch(query);
};

/**
 * Convert JSON response into target format
 * @param result
 * @returns {{symbol: *, priceTargets: {mean: number, median: number, highest: number, lowest: number, numberOfEstimates: number}}}
 */
const formatPriceTargets = result => {
  let sum = 0;
  let estimates = [];
  let t = {
    mean: 0,
    median: 0,
    highest: 0,
    lowest: 100000,
    numberOfEstimates: 0
  };
  let out = {
    symbol: result.ticker,
    priceTargets: t
  };

  result.experts.forEach(expert => {
    const recordDate = moment(expert.ratings[0].time);
    if (
      moment().diff(recordDate, 'months') < 4 &&
      expert.ratings[0].priceTarget !== null
    ) {
      t.highest =
        expert.ratings[0].priceTarget > t.highest
          ? expert.ratings[0].priceTarget
          : t.highest;
      t.lowest =
        expert.ratings[0].priceTarget < t.lowest
          ? expert.ratings[0].priceTarget
          : t.lowest;
      t.numberOfEstimates++;
      estimates.push(expert.ratings[0].priceTarget);
      sum += expert.ratings[0].priceTarget;
    }
  });

  t.mean = sum / t.numberOfEstimates;
  t.median = h.median(estimates);

  return out;
};

/**
 *
 * @param result
 * @returns {{symbol: *, sentiment: *, buzz: *, sectorAverageBullishPercent: *, sectorAverageNewsScore: *, companyNewsScore: *}}
 */
const formatNewsSentiment = result => {
  let out = {
    symbol: result.ticker,
    sentiment: result.sentiment,
    buzz: result.buzz,
    sectorAverageBullishPercent: result.sectorAverageBullishPercent,
    sectorAverageNewsScore: result.sectorAverageNewsScore,
    companyNewsScore: result.score
    // wordCloud: [
    //   // {grade: 4, counts: 10}
    // ]
  };

  return out;
};

const printCliInfo = () => {
  console.log('\nCall with "command" and "ticker". E.g.\n');
  console.log('\ttipranks-api-v2 price-targets TSLA\n');
  console.log('\tOR\n');
  console.log('\ttipranks-api-v2 news-sentiment TSLA\n');
  console.log('\tOR\n');
  console.log('\ttipranks-api-v2 trending\n');
};

const printResult = result => {
  console.log(JSON.stringify(result, null, 2));
};

const getArgs = () => {
  if (process.argv.length !== 4) {
    printCliInfo();
    process.exit();
  }
  return [process.argv[2], process.argv[3]];
};

if (require.main === module) {
  const [command, ticker] = getArgs();
  let fn;

  switch (command) {
    case 'price-targets':
    case 'price-target':
      fn = this.getPriceTargets;
      break;
    case 'news-sentiment':
    case 'news-sentiments':
      fn = this.getNewsSentimentData;
      break;
    case 'trending':
      fn = this.getTrendingStocks;
      break;
    default:
      printCliInfo();
      process.exit();
  }

  fn(ticker)
    .then(printResult)
    .catch(printResult);
}
