var fs = require('fs');
var execSync = require('child_process').execSync;

var no_frills_endpoint = 'http://www.nofrills.ca/banners/publication/v1/en_CA/NOFR/current/';
var headers = `-X POST -H 'Cookie: JSESSIONID=0001VjSBD8ZOhtDgdDYldX_I9pW:-H88BM; storeIdCookie=292; storeNumCookie=784; storeProvienceCookie=ON; SessionPersistence-publish=CLIENTCONTEXT%3A%3DvisitorId%3D%2CvisitorId_xss%3D%7CPROFILEDATA%3A%3D%7C; cq5pr=CQ5_HER; NSC_qsdrif.mpcmbx.db_80=ffffffff0960541945525d5f4f58455e445a4a423660' -H 'Origin: http://www.nofrills.ca' -H 'Accept-Encoding: gzip, deflate, lzma' -H 'Accept-Language: en-GB,en-US;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.82 Safari/537.36 OPR/39.0.2256.48' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Accept: application/json' -H 'Referer: http://www.nofrills.ca/en_CA/flyers.banner@NOFR.storenum@784.week@current.html' -H 'X-Requested-With: XMLHttpRequest' -H 'Connection: keep-alive' -H 'Content-Length: 0' --compressed `;

var curlNumOfProducts = `curl '${no_frills_endpoint}784/items?start=0&rows=1&tag=' ${headers}| jq .flyerResponse.numFound`;
var numOfProducts = String(execSync(commands.numOfProducts)).trim();

var curlAllProducts = `curl '${no_frills_endpoint}784/items?start=0&rows=${numOfProducts}&tag=' ${headers}| jq .flyerResponse.docs`;
var allProducts = execSync(secondCommand);

fs.writeFile('no_frills_XML.json', allProducts);

