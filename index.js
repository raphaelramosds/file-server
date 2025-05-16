import http from 'http';
import formidable from 'formidable';
import fs from 'fs/promises';

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method == 'GET' && req.url == '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({message: 'Server is alive!'}) );
    }

    else if (req.method === 'POST' && req.url === '/file') {
        const form = formidable({});
        let filepath;
        let fields;
        let files;
        
        try {
            [fields, files] = await form.parse(req);
        } catch (err) {
            console.error(err);
            res.writeHead(400, { 'Content-Type' : 'text/plain' });
            res.end(String(err));
        }

        if (files.file) {
            filepath = files.file[0].filepath;
        }

        try {
            const data = await fs.readFile(filepath, {encoding: 'utf8'});
            console.log('File content:');
            console.log(data);
        } catch (err) {
            console.log(err);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'File upload successfully'}, null, 2));
    }

    else {
        res.statusCode = 404;
        res.end('Resource ' + req.method + ' ' + req.url + ' is unknown');
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});