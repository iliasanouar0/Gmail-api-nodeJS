const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


const getRefreshToken = async (data) => {
    console.log(data);
}


module.exports = {
    getRefreshToken
}

