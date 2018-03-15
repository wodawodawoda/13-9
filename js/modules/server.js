const http = require('http'),
	colors = require('colors'),
	handlers = require('./handlers.js');

function start() {
	function onRequest(request, response) {
		console.log('Odebrano zapytanie.');
		console.log(`Zapytanie ${request.url} odebrane`);

		response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });


		if (/\.css$/.test(request.url) ||
			/\.html$/.test(request.url) ||
			/\.js$/.test(request.url) ||
			/\.png$/.test(request.url)) {
			handlers.data(request, response);
		} else if (request.url === '/') {
			response.writeHead(302, { 'Location': '/.html' });
			response.end();
		} else {
			handlers.error(request, response);
		}
	}

	http.createServer(onRequest).listen(3000);

	console.log("Run server".green);
}

exports.start = start;