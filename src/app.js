const express =  require('express');

const app = express();

app.use(express.static('src'));
app.use(express.static('build'));

app.listen(3000);
console.log('started listening on port 3000');