const moment = require('moment');
const https  = require('https');

/**
 *
 * @param t0Value
 * @param t1Value
 * @returns {number}
 */
module.exports.getGrowthPercentage = (t0Value, t1Value) => {
  const result = (t1Value - t0Value) / t0Value * 100;
  const intResult = parseInt(result);
  return intResult;
};

module.exports.getMonthDelta = (t0Date, t1Date) => {
  return Math.ceil(moment(t1Date).diff(moment(t0Date), 'months', true));
};

/**
 * Source: https://stackoverflow.com/questions/45309447/calculating-median-javascript?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
 * @param values
 * @returns {*}
 */
exports.median = (values) => {
  values.sort(function(a,b) {
    return a-b;
  });

  if(values.length ===0) return 0;

  let half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];
  else
    return (values[half - 1] + values[half]) / 2.0;
};


/**
 * HTTPS GET API
 * resolve returns JSON-parsed response
 *
 * @param query
 * @returns {Promise}
 */
exports.fetch = (query) => {
  return new Promise((res, rej) => {
    get(0, query, res, rej);
  });
};

const get = (retry = 0, query, resolve, reject) => {

  const headers = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    'cookie': 'visid_incap_971406=Km6BxXMhSuayG9HtQxLu3JTOUlsAAAAAQUIPAAAAAACKjy2oW3qpi0lIis+8tFVR; nlbi_971406=STNrPkz79kmTfqgBB0ZnaQAAAAC4dvslsliSGOxANhSe3QvQ; filters={%22sector%22:%22general%22%2C%22period%22:%22yearly%22%2C%22benchmark%22:%22none%22}; _ga=GA1.2.1068525719.1532153495; _gid=GA1.2.649486260.1532153495; ai_user=cq1We|2018-07-21T06:11:35.402Z; km_ai=N8WEl4YX%2F5hEIhq6SqKv5rMr%2FUw%3D; abtests=0,0; incap_ses_972_971406=Kp8ZcTvsBC64TzjGNj19DTviUlsAAAAA9MIMnFTs8qVySykb6CzxCQ==; km_vs=1; km_lv=x; kvcd=1532163159523; ai_session=hmzdP|1532162289250|1532163633527.5; _ceg.s=pc7lic; _ceg.u=pc7lic; _gat=1; _gat_UA-38500593-6=1'
  };

  const parts = query.split('/');

  const options = {
    protocol: 'https:',
    port: '443',
    hostname: parts[2],
    path: parts.reduce((a, b, i) =>  (i > 2) ? a + '/' + b : ''),
    headers
  };

  https.request(options, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      if ((resp.headers['content-type'] || '').includes('application/json')) {
        resolve(JSON.parse(data));
      } else {
        retry++;
        retry > 3 ? reject() : setTimeout(get, 1000, retry, query, resolve, reject)
      }
    });

  }).on('error', (err) => {
    reject(err);
  }).end();
};