const fs = require('fs');
const http = require('http');
const url = require('url');
const slug = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////////////////////////////////////////////////
// File

// Blocking, the synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
// console.log(textIn);

// const textOut = `This is what we know about avocado: ${textIn}\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/outout1.txt', textOut);
// console.log('File written');

// Non-blocking, the asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err1, data1) => {
//   if (err1) return console.error(`ERROR: ${err1}😨`);
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err2, data2) => {
//     if (err2) return console.error(`ERROR: ${err2}😨`);
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err3, data3) => {
//       if (err3) return console.error(`ERROR: ${err3}😨`);
//       console.log(data3);
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err4 => {
//         if (err4) return console.error(`ERROR: ${err4}😨`);
//         console.log('File written😄');
//       })
//     });
//   });
// });
// console.log('Will read file...');

////////////////////////////////////////////////////////////////////////////
// Server
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slug(el.productName, { lower: true }))

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (['/', '/overview'].includes(pathname)) {
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(output);
    // Product page
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const productHtml = replaceTemplate(tempProduct, product);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(productHtml);
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(dataObj);
    // Api page
  } else {
    // Not found page
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8080, '127.0.0.1', () => {
  console.log('Server is listening on 8080');
});