var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');

var path = require('path')

router.use(express.static(__dirname+'/public'));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

//相应前端发送的请求，读取对应位置的文件，并把文件内容返回给前端
router.post('/get',function (req,res,next) {
	var list = '';
	var readerStream = fs.createReadStream(path.resolve(__dirname, '../public/files/task.txt'));
	readerStream.setEncoding('UTF8');
	readerStream.on('data',function(chunk)
	{
		list += chunk;
	});
	readerStream.on('end',function()
	{
		//console.log(list);
		//list = JSON.parse(list);
		//console.log(list);
		res.send(list);
	});
	readerStream.on('error',function(err)
	{
		//console.log(err.stack);
	});
});

//相应前端发送的请求以及内容，将内容写进对应位置的文件
router.post('/push',function (req,res,next) {
	var list = req.body;
	list = JSON.stringify(list);
	var writeStream = fs.createWriteStream(path.resolve(__dirname, '../public/files/task.txt'));
	writeStream.write(list,'UTF8');
	writeStream.end();
	writeStream.on('finish',function()
	{
		console.log("finish");
	});

	writeStream.on('error',function(err)
	{
		console.log(err.stack);
	});
	res.send(req.body);
});

module.exports = router;
