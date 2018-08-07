const api = require('./index');

api.getPriceTargets('MU').then(result => console.log(result));

api.getNewsSentimentData('MU').then(result => console.log(result));
