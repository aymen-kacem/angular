const https = require('https');

const apiKey = "AIzaSyBsLAOuCcWTn1w8iczGBfHBgGD1689AJ5s";
const data = JSON.stringify({
  email: "aymenkacem@gmail.com",
  password: "123456789",
  returnSecureToken: true
});

const options = {
  hostname: 'identitytoolkit.googleapis.com',
  port: 443,
  path: `/v1/accounts:signInWithPassword?key=${apiKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Response: ${body}`);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
