/**
 * Created by twohappy on 2017/3/23.
 */
const express = require('express');
const mongoose = require('mongoose');
const serveStatic = require('serve-static');
//这个中间件可以把post.body里面的内容初始化成一个对象
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const muliparty = require('connect-multiparty');
const MongoStore = require('connect-mongo')(session);
const port = process.env.PORT || 3000;
const app = express();

const MONGOPORT = 12345;
const MONGOCOLLECTION = 'movie';
let dbUrl = 'mongodb://localhost:' + MONGOPORT + '/' + MONGOCOLLECTION;
mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

app.set('views', './app/views/pages');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended: true}));
app.use(serveStatic('public'));
app.use(cookieParser());
app.use(muliparty());
app.use(session({
    secret: 'imooc',
    store: new MongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));
app.listen(port);

if('development' === app.get('env')){
    app.set('showStaticError',true);
    app.use(morgan(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug',true);
}

require('./config/routes')(app);
console.log('started on port ' + port);
