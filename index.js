const express = require('express');
const helmet = require('helmet');
const PORT = process.env.PORT || 4444;
const fs = require('fs');
const path = require('path');
const app = express();

app.use(helmet());
app.use((req, res, next) => {
    res.removeHeader('Strict-Transport-Security');
    next();
})
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    
    const stream = fs.createReadStream(path.join(__dirname, 'static', 'index.html'));
    stream.pipe(res);
});

app.get('/test', (req, res) => {
    res.end('this just a test resource')
})

app.listen(PORT, () => console.log(`Express server has been successfully built and started on port ${PORT}`));
