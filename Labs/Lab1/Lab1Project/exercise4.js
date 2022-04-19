const http = require('http');
const URL = require('url').URL;
const shopList = ['apples', 'milk', 'bread', 'eggs', 'flour'];

http.createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    const parameters = url.searchParams;


    response.writeHead(200,
        {'Content-Type': 'text/plain'
        });
    let itemNum = parseInt(parameters.get('itemNum'));
    response.end(`ItemName, ItemNum: ${shopList[itemNum]}, ${itemNum}`);
}).listen(8081);

console.log('Server running at http:/127.0.0.1:8081/');