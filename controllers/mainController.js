exports.beesInfoPage = (req, res) => {
    res.sendFile(`${__approot}/html/beesinfo.html`);
}

exports.mainPage = (req, res) => {
    res.sendFile(`${__approot}/html/main.html`);
}

exports.signUpPage = (req, res) => {
    res.sendFile(`${__approot}/html/signup.html`);
}


exports.signInPage = (req, res) => {
    res.sendFile(`${__approot}/html/signin.html`);
}