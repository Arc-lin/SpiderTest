/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url = "https://bwh1.net/cart.php";
//初始url


function sendRequest(urlStr,callback,errorCallback) {
  request(urlStr, function(error,response,body) {
    if (!error && response.statusCode == 200) {
        callback(body);
    } else {
        errorCallback(error);
    }
  });
}

function parseHtml(body) {

  const $ = cheerio.load(body);

  var profiles = [];
  var titles = [];
  $("#whmcsorderfrm table tr:first-child").each(function(i,e) {
      var profile = {};
      var td = $(this).children("td");
      profile.title     = td.eq(0).children("strong").text().trim();
      profile.price     = td.eq(1).text().trim().split("\n");
      profile.can_order = (td.eq(2).text().trim() == "(out of stock)") ? "0" : "1";

      var url_str   = td.eq(2).children("input").attr("onclick");
      profile.url   = url_str;
      profiles[i] = profile;
  });
  return profiles;
}

function callPack(success,message,data) {
  var code = 200;
  var result = {
    code    : success ? 200 : 501,
    message : message,
    data    : data
  };
  return result;
}

//主程序开始运行
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/bwh', function(req, res, next) {
    sendRequest(url, (body) => {
        var result = callPack(true,"",parseHtml(body));
        res.send(result);
    },(error) => {
        var result = callPack(false,error,"");
        res.send(result);
    });
});

module.exports = router;
