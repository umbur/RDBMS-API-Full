const server = require('./api/server.js');

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is working' });
})

const port = 5000;
server.listen(port, () => {
console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
