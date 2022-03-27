const express = require('express');
const authController = require('../controllers/authController');
const servicesController = require('../controllers/servicesController');
const renderError = require('../utils/renderError')
const formidable = require('formidable')

exports.getHomePage = (req, res) => {
    res.render('index')
}

exports.getLoginPage = (req, res) => {
    if (req.session.user)
        return renderError(res, null, null, new Error("Already logged in!"))
    return res.render('login')
}

exports.postLoginPage = async (req, res) => {
    const formular = new formidable.IncomingForm();
    formular.parse(req, async (err, data) => {
        if (err)
            return renderError(res, null, null, err)
        const user = await authController.login(data.username, data.password)
        if (!user) {
            return res.render('login', { error: true, message: "Not found" })
        }
        if (authController.setSession(user, req) == true)
            return res.redirect('/')
        return res.render('login', { error: true, message: "Error loggin in. Contact support" })
    })
}

exports.getSignUpPage = (req, res) => {
    if (req.session.user)
        return renderError(res, null, null, new Error("Already logged in!"))
    return res.render('signup')
}

exports.postSignUpPage = async (req, res) => {
    const formular = new formidable.IncomingForm();
    formular.parse(req, async (err, data) => {
        if (err)
            return renderError(res, null, null, err)
        try {
            const user = await authController.signup(data.username, data.firstname, data.lastname, data.password, data.email)
            if (!user) {
                throw new Error("User not signed up.")
            }
            res.redirect('/')
        } catch (err) {
            res.render('signup', { error: true, message: err })
        }

    })
}

exports.getPlayPage = async (req, res) => {
    const services = await servicesController.getServices(req.session.user.idUser)
    res.render("play", { services })
}

exports.getGeneralPage = (req, res, next) => {
    res.render(`${req.url.split('?')[0].substring(1)}`, (err, rezultatRender) => {
        console.log(err)
        if (err)
            return next(err)
        res.send(rezultatRender);
    });
}

exports.getLogOutPage = (req, res, next) => {
    authController.destroySession(req)
    return res.redirect('/')
}