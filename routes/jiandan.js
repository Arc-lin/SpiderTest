/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url = "http://jandan.net/ooxx/";
//初始url


function sendRequest(urlStr,callback,errorCallback) {

var options = { method: 'GET',
  url: urlStr,
  headers: {
     'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
   }
  };
  request(options, function (error, response, body) {
    if (error) {
      errorCallback(error);
    } else {
      callback(body);
    }
  });

}

function parseHtml(body) {

  const $ = cheerio.load(body);

  var datas = [];
  $("#comments ol li").each(function(i,e) {
      var data = {};
      var src = $(this).find("img").attr("src");
      var origin_src = $(this).find(".view_img_link").eq(0).attr("href");
      var id = $(this).attr("id").split("-")[1];
      data.id = id;
      data.img_src = "http:" + src;
      data.origin_src = "http:" + origin_src;
      datas[i] = data;
  });
  return datas;
}

function getMaxPage(body) {
  const $ = cheerio.load(body);
  var maxPage = $("#comments").find(".current-comment-page").eq(0).text();
  return maxPage;
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

router.post('/', function(req, res, next) {
    sendRequest(url,(body) => {
      var result = getMaxPage(body);
      var maxPage = result.substring(1,4);
      var page = req.body.page;
      var true_page = parseInt(maxPage) + 1 - parseInt(page);
      var true_url = url+'page-'+true_page;
      sendRequest(true_url, (body) => {
          var result = callPack(true,"",parseHtml(body));
          res.send(result);
      },(error) => {
          var result = callPack(false,error,"");
          res.send(result);
      });
    },(error) => {
      var result = callPack(false,error,"");
      res.send(result);
    });

});

module.exports = router;
