const fs = require('fs'),
	formidable = require('formidable'),
	path = require('path'),
	mkdirp = require('mkdirp');

let pathes = {
	img: [],
	url: []
};


let obj = {
	html: {
		path: `html.html`,
		content: '"Content-Type": "text/html; charset=utf-8"'
	}
}


const info = `Rozpoczynam obsługę rządania`;
// function ref(request) {return /.+\/(.*)$/.exec(request.headers.referer)};
// function ref(request) {return (request.headers.referer).match(/.+\/(.*)$/)};

let lastImage;
function upload(request) {
	console.log("Rozpoczynam obsługę rządania upload");
	const form = new formidable.IncomingForm();
	form.parse(request, function(error, fields, files) {
		lastImage = fields.title || files.upload.name;
		mkdirp("./images", function(err) {
			fs.copyFileSync(files.upload.path, `images/${lastImage}`); // fs.rename cause cross-origin error
		});
	});
};

// exports.start = function(request, response) {
// 	fs.readFile('html/.html', function(err, html) {
// 		response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
// 		response.write(html);
// 		response.end();
// 	});
// };

exports.data = function(request, response) {
	// const referer = /.+\/(.*)$/.exec(request.headers.referer)[1];
	if (request.url === '/upload.html') {upload(request)};
	const url = request.url === '/.png' ? lastImage : request.url;
	const type = request.url === '/.png' ? 'images/' : /\.(.*)/.exec(url)[1];
	const bin = request.url === '/.png' ? 'binary' : '';
	fs.readFile(`${type}${url}`, bin, function(err, data) {
		response.writeHead(200, `{"Content-Type": "text/${type}"}`);
		response.write(data, bin);
		response.end();
	});
};


exports.show = function(request, response) {
	fs.readFile(pathes.img[0], "binary", function(error, file) {
		console.log(pathes.img[0])
		response.writeHead(200, { "Content-Type": "png" });
		response.write(file, "binary");
		response.end();
	});
};

exports.error = function(request, response) {
	console.log("Nie wiem co robić.");
	response.write("404 :(");
	response.end();
};