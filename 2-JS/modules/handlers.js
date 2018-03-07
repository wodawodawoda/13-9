const fs = require('fs'),
	formidable = require('formidable'),
	path = require('path');

exports.start = function(request, response) {
	console.log('Rozpoczynam obsługę żądania start');
	fs.readFile('3-HTML/start.html', function(err, html) {
		response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
		response.write(html);
		response.end();
	});
};

exports.startCSS = function(request, response) {
	console.log(response.url);
	fs.readFile('0-CSS/start.css', function (err, css) {
		response.writeHead(200, {'Content-Type': 'text/css'});
		response.write(css);
		response.end();
	});
};


exports.upload = function(request, response) {
	// console.log(request.url);
	console.log('Rozpoczynam obsługę żądania upload');
	const form = new formidable.IncomingForm();
    form.parse(request, function(error, fields, files) {
    	const name = fields.title || files.upload.name;
        fs.copyFileSync(files.upload.path, `images/${name}`); // fs.rename cause cross-origin error
        fs.readFile('3-HTML/upload.html', function(err, html) {
			response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			response.write(html);
			response.end();
		});
    });
};

exports.show = function(request, response) {
	fs.readdir('images', function(err, files) {
		console.log(files);
		let last = 'images/' + files[0]; // TODO: sort files array by upload date
		fs.readFile(last, "binary", function(error, file) {
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