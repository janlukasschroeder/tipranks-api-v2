const api = require('./index');

api.getPriceTargets('TSLA').then(result => console.log(result));

api.getNewsSentimentData('TSLA').then(result => console.log(result));
