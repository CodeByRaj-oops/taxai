// Simple Express server
const express = require('express');
const app = express();
const PORT = 3005;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
}); 