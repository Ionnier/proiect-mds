const express = require('express')
const morgan = require('morgan');
const session = require('express-session');
const viewRouter = require('./routers/viewRouter');
const creditsRouter = require('./routers/creditsRouter');
const servicesRouter = require('./routers/servicesRouter');
const roomsRouter = require('./routers/roomsRouter');
const randomGuessRouter = require('./routers/randomGuessRouter');
const {notificationsRouter, setUpNotificationServer} = require('./routers/notificationsRouter')
const path = require('path')
const webpush = require('web-push')

setUpNotificationServer()

const app = express();

app.set("view engine", "ejs")

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));

app.use("/*", (req, res, next) => {
    if (process.env.MENTENANTA && process.env.MENTENANTA.toLowerCase() === 'true') {
        res.end('Website is in maintenance mode.')
        return
    } else {
        //console.log(req.session.user)
        res.locals.user = req.session.user
        next()
    }
})

if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'));
}

app.use(['/resources/js/reminderNotification.js', '/resources/js/reminderNotification'], (req, res) =>{
    const headers = {
        'Content-Type': 'application/javascript',
        'Service-Worker-Allowed': '/'
    }
    res.sendFile(path.join(__dirname, 'resources', 'js', 'reminderNotification.js'), {headers})
})

app.use("/resources", express.static(__dirname + "/resources"))

app.use('/api/credits', creditsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/rooms', roomsRouter)
app.use('/api/rgg/', randomGuessRouter)
app.use('/notifications/', notificationsRouter);
app.use('/', viewRouter);

app.use('*', (err, req, res, next) => {
    if (req.originalUrl.startsWith('/api'))
        return res.status(418).json({ success: false, message: err.message })
    res.status(418).render("error", { statuscode: 418, image: "/resources/images/error.png", err: err })
})

module.exports = app;