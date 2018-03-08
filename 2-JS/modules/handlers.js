const fs = require('fs'),
	formidable = require('formidable'),
	path = require('path'),
	mkdirp = require('mkdirp'); 

let pathes = {
	img: [],
	url: []
};

const info = `Rozpoczynam obsługę rządania`;

exports.start = function(request, response) {
	pathes.url.unshift(request.url); // Zamiast dodawania do patches użyć server.acturl
	console.log('Rozpoczynam obsługę rządania start');
	fs.readFile('3-HTML/start.html', function(err, html) {
		response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
		response.write(html);
		response.end();
	});
};

exports.upload = function(request, response) {
	pathes.url.unshift(request.url);
	console.log("Rozpoczynam obsługę rządania upload");
	const form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
    	const name = fields.title || files.upload.name;
    	pathes.img.unshift(`images/${name}`);
        mkdirp("./images", function(err) {
	        fs.copyFileSync(files.upload.path, `images/${name}`); // fs.rename cause cross-origin error
        });
        fs.readFile(`3-HTML${pathes.url[0]}.html`, function(err, html) {
			response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			response.write(html);
			response.end();
		});
    });
};

exports.css = function(request, response) {
	fs.readFile(`0-CSS${pathes.url[0]}.css`, function (err, css) {
		response.writeHead(200, {"Content-Type": "text/css"});
		response.write(css);
		response.end();
	});
};

exports.js = function(request, response) {
	fs.readFile(`2-JS${patches.url[0]}.js`, function (err, js) {
		response.writeHead(200, {"Content-Type": "text/javascript"});
		response.write(js);
		response.end();
	});
};

exports.show = function(request, response) {
	fs.readdir("images", function(err, files) {
		fs.readFile(pathes.img[0], "binary", function(error, file) {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		});
	});
};

exports.error = function(request, response) {
	console.log("Nie wiem co robić.");
	response.write("404 :(");
	response.end();
};