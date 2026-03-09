const http = require("http");

const server = http.createServer((req, res) => {
  let body = "";
  req.on("data", (chunk) => body += chunk);
  req.on("end", () => {
    try {
      const obj = JSON.parse(body);
      console.log("Received at REST endpoint:", obj);
      res.writeHead(200); res.end("OK");
    } catch (e) {
      res.writeHead(400); res.end("Bad JSON");
    }
  });
});

server.listen(3000, () => console.log("Mock endpoint listening on port 3000"));
