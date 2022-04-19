const http = require('http');
const URL = require('url').URL;

http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const parameters = url.searchParams;


    response.writeHead(200,
        {'Content-Type': 'text/plain'
        });

    response.end(`Here is your data: ${parameters}`);
}).listen(8081);

console.log('Server running at http:/127.0.0.1:8081/');