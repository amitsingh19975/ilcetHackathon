const express = require('express');
const ejs = require("ejs")
const bodyParser = require('body-parser')
const path = require('path')
let port = process.env.PORT || 8081;
const cmd = require('node-cmd')
const pytalk = require('pytalk');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')))


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/services', (req, res) => {
    res.render('services');
});

app.post('/python', (req, res) => {
        let images = req.body;
        if(images.length > 1){
            images = `./public/images/${images[0]}.jpg ./public/images/${images[1]}.jpg`;
            cmd.get(`./public/python/structure_change.py ${images}`, function (err, data, stderr) {
                if (stderr) console.log(stderr);
                if (err) console.log(err);
                let temp = data.split('\n');
                console.log(temp);

                res.json({'data':temp});
            }
        );
        }else{
            images = `./public/images/${images[0]}.jpg`;
            cmd.get(`./public/python/Vi.py ${images}`, function (err, data, stderr) {
                if (stderr) console.log(stderr);
                if (err) console.log(err);
                let temp = data.split('\n');
                console.log(temp);

                res.json({'data':temp});
            }
        );
        }    
});

app.get('/message', (req, res) => {
    cmd.get(`./public/python/Sigimera.py`, function (err, data, stderr) {
        if (stderr) console.log(stderr);
        if (err) console.log(err);
        let temp = data.split('\n');
        let t = [];
        for(let x in temp){
            if(temp[x] !=''){
                t.push(temp[x]);
            }
        }
        console.log(t);
        res.json({'data':t});
    });
});
app.post('/python/sms', (req, res) => {
    cmd.get(`python3 ./public/python/sms.py`, function (err, data, stderr) {
        if (stderr) console.log(stderr);
        if (err) console.log(err);
        console.log(data);
        res.send('Sending Complete');
    });
});


app.post('/python/email', (req, res) => {
    cmd.get("./public/python/gmail.py bahushruth.bahushruth@gmail.com", function (err, data, stderr) {
        if (stderr) console.log(stderr);
        if (err) console.log(err);
        res.send('Sending Complete');
    });
});
app.get('/getApiKey', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        key: 'AIzaSyB0Vcu8VZBdX2sd2tHdU52IVTQwNOq_B-A'
    }));
});

app.get('*', (req, res) => {
    res.send('404 Error');
});

app.listen(port, () => {
    console.log(`http://localhost:${8081}`);
});