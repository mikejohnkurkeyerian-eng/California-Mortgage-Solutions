import { createServer } from "http";

const port = process.env.PORT ?? 4001;

const server = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "auth-service placeholder" }));
});

server.listen(port, () => {
  console.log(`auth-service listening on ${port}`);
});


