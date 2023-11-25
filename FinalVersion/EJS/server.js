var express = require('express');
const mongoose = require('mongoose');

var app = express();
var path = require('path');



//init view engine
app.set('view engine', 'ejs');

//set dir path
app.use(express.static(path.join(__dirname, 'public')));

////////////////////////////////////////////////
//               Add routes here              //
////////////////////////////////////////////////

app.get('/ProducerPage', async function(req,res){
    res.render('');
})


//additional sandbox data
app.get('/', function (req, res) {
    res.render('index', {
        data: {
            fExplore: ['Explore1', 'Explore2', 'Explore3'],
            fExclusive: ['Exclusive1', 'Exclusive2', 'Exclusive3', 'Exclusive4'],
            fInfo: ['Info1', 'Info2', 'Info3', 'Info4'],
            fServ: ['Service1', 'Service2'],
            fHeader: ['Explore', 'Exclusives', 'Information', 'Services'],
            fExtra: ['Help', 'Privacy Policy', 'Terms of Use', 'Mission']
        }
    });
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});