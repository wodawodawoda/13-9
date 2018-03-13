const http = require('http'),
	colors = require('colors'),
	handlers = require('./handlers.js');

function start() {
	function onRequest(request, response) {
		console.log('Odebrano zapytanie.');
		console.log(`Zapytanie ${request.url} odebrane`);

		response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });

		switch (request.url) {
			case "/":
				response.writeHead(302, {
					'Location': '/.html'
					//add other headers here...
				}); 
				response.end();
				// handlers.start(request, response);
				break;
			case "/upload":
				handlers.upload(request, response);
				break;
			// case "/show":
			// 	handlers.show(request, response);
			// 	break;
			case "/.css":
			case "/.js":
			case "/.html":
			case "/upload.html":
			case "/.png":
				handlers.data(request, response);
				break;
			default:
				handlers.error(request, response);
		}
	}

	http.createServer(onRequest).listen(3000);

	console.log("Run server".green);
}

exports.start = start;

// exports.acturl = request.url // Eksport do handlers??