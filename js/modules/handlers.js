const fs = require('fs'),
	formidable = require('formidable'),
	path = require('path'),
	mkdirp = require('mkdirp');

let lastImage;

// Save uploaded img on server
function upload(request) {
	console.log("Rozpoczynam obsługę żądania upload");
	const form = new formidable.IncomingForm();
	form.parse(request, function(error, fields, files) {
		lastImage = fields.title || files.upload.name;
		mkdirp("./images", function(err) {
			fs.copyFileSync(files.upload.path, `images/${lastImage}`); // fs.rename cause cross-origin error
		});
	});
}

// Send html,css,js,img requests to client 
exports.data = function(request, response) {
	if (request.url === '/upload.html') { upload(request); } // Run upload to save img on server
	let params = [request.url, /\.(.*)/.exec(request.url)[1], '']; // Default file display parameters
	if (request.url === '/.png') { params = [lastImage, 'images/', 'binary']; } //.png image display parameters
	let [url, type, bin] = [...params];
	fs.readFile(`${type}${url}`, bin, function(err, data) {
		response.writeHead(200, `{"Content-Type": "text/${type}"}`);
		response.write(data, bin);
		response.end();
	});
};

exports.error = function(request, response) {
	console.log("Nie wiem co robić.");
	response.write("404 :(");
	response.end();
};