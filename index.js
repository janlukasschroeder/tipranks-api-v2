const h = require('./helpers');
const config = require('./config');
const moment = require('moment');

/**
 *
 * @param symbol
 * @returns {Promise.<TResult>}
 */
module.exports.getNewsSentimentData = (symbol) => {

  const timestamp = moment().unix();
  const query = config.tipranks.baseUrl + `getNewsSentiments/?ticker=${symbol.toLowerCase()}&break=${timestamp}`;

  return h.fetch(query).then(result => {
    return formatNewsSentiment(result);
  });
};

/**
 * Get price targets of symbol
 * @param symbol
 * @returns {Promise.<TResult>}
 */
module.exports.getPriceTargets = (symbol) => {

  const timestamp = moment().unix();
  const query = config.tipranks.baseUrl + `getData/?name=${symbol.toLowerCase()}&benchmark=1&period=3&break=${timestamp}`;

  return h.fetch(query).then(result => {
    return formatPriceTargets(result);
  });
};

/**
 * Convert JSON response into target format
 * @param result
 * @returns {{symbol: *, priceTargets: {mean: number, median: number, highest: number, lowest: number, numberOfEstimates: number}}}
 */
const formatPriceTargets = (result) => {
  let sum = 0;
  let estimates = [];
  let t = {
    mean: 0,
    median: 0,
    highest: 0,
    lowest: 100000,
    numberOfEstimates: 0,
  };
  let out = {
    symbol: result.ticker,
    priceTargets: t
  };

  result.experts.forEach(expert => {
    const recordDate = moment(expert.ratings[0].time);
    if (moment().diff(recordDate, 'months') < 4 && expert.ratings[0].priceTarget !== null) {
      t.highest = (expert.ratings[0].priceTarget > t.highest) ? expert.ratings[0].priceTarget : t.highest;
      t.lowest = (expert.ratings[0].priceTarget < t.lowest ) ? expert.ratings[0].priceTarget : t.lowest;
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
const formatNewsSentiment = (result) => {
  let out = {
    symbol: result.ticker,
    sentiment: result.sentiment,
    buzz: result.buzz,
    sectorAverageBullishPercent: result.sectorAverageBullishPercent,
    sectorAverageNewsScore: result.sectorAverageNewsScore,
    companyNewsScore: result.score,
    // wordCloud: [
    //   // {grade: 4, counts: 10}
    // ]
  };

  return out;
};