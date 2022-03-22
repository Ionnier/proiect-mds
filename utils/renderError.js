module.exports = (res, statuscode, image, err) => {
    if (!statuscode)
        statuscode = 418
    if (!image)
        image = "/resources/images/error.png"
    return res.status(statuscode).render("error", { statuscode, image, err })
}