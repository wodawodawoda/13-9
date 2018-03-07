const fs = require('fs'),
	formidable = require('formidable'),
	path = require('path');

exports.start = function(request, response) {
	console.log('Rozpoczynam obsługę rządania start');
	fs.readFile('3-HTML/start.html', function(err, html) {
		response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
		response.write(html);
		response.end();
	});
};

exports.startCSS = function(request, response) {
	fs.readFile('0-CSS/start.css', function (err, css) {
		response.writeHead(200, {'Content-Type': 'text/css'});
		response.write(css);
		response.end();
	});
};

let freshImg; // global for exports.show
exports.upload = function(request, response) {
	console.log('Rozpoczynam obsługę rządania upload');
	const form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
    	const name = fields.title || files.upload.name;
    	freshImg = `images/${name}`;
        fs.copyFileSync(files.upload.path, `images/${name}`); // fs.rename cause cross-origin error
        fs.readFile('3-HTML/upload.html', function(err, html) {
			response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			response.write(html);
			response.end();
		});
    });
};

// TODO - uploadCSS, startCSS to one exports object  "fs.readFile('path based on actual url'...)"
exports.uploadCSS = function(request, response) {
	fs.readFile('0-CSS/upload.css', function (err, data) {
		response.writeHead(200, {'Content-Type': 'text/css'});
		response.write(data);
		response.end();
	});
};

exports.uploadJS = function(request, response) {
	fs.readFile('2-JS/script.js', function (err, data) {
		response.writeHead(200, {'Content-Type': 'text/javascript'});
		response.write(data);
		response.end();
	});
};

exports.show = function(request, response) {
	fs.readdir('images', function(err, files) {
		console.log(files);
		fs.readFile(freshImg, "binary", function(error, file) {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		});
	});
};

exports.error = function(request, response) {
	console.log('Nie wiem co robić.');
	response.write("404 :(");
	response.end();
};