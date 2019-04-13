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
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
    'cookie': 'filters={%22sector%22:%22general%22%2C%22period%22:%22yearly%22%2C%22benchmark%22:%22none%22}; _ga=GA1.2.1399008322.1555113821; _gid=GA1.2.199147539.1555113821; D_IID=B9E15023-3DD7-3BB9-9D06-5B9C2C9C6A69; D_UID=58866189-FC50-314E-B158-F1E9D40FDC1C; D_ZID=474CF837-B3C6-3AD7-839D-E3B1EB8D16DA; D_ZUID=E0A8F62F-25D5-3A98-BBAA-00DD3A87316A; D_HID=3BE3BCD8-6BF8-3F9D-8E6A-D7B4CE314A4B; D_SID=218.214.31.158:if63DotFdVOpAoT1ZWpV+grUhn/qeYWJpFO7Pfg2DoI; tr-experiments-version=1.04; tipranks-experiments=%7b%22Experiments%22%3a%5b%7b%22Name%22%3a%22first-few-analyst-ratings%22%2c%22Variant%22%3a%22default%22%7d%2c%7b%22Name%22%3a%22go-pro-variant%22%2c%22Variant%22%3a%22v2%22%7d%5d%7d; ai_user=eSsrp|2019-04-13T00:03:42.201Z; kvcd=1555113823522; km_ai=NsaUIpg2Gg7ZEYz9%2FJj6g8eHQtM%3D; km_vs=1; km_lv=1555113824; ai_session=r5v1F|1555113823571.08|1555114091199.975'
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