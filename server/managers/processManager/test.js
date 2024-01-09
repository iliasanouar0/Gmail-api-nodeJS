const fs = require('fs')
const setTimeout = require('timers/promises');
let time = setTimeout.setTimeout
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const cookies = './cookies'

const login = async (data, mode) => {
    let feedback = ''
    let arg
    if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
        arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
    } else {
        const proxyServer = `${data.proxy}`;
        arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
    }
    console.log(`Opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
    console.log(` `);
    const browser = await puppeteer.launch({ headless: false, args: arg })
    const page = await browser.newPage()
    await page.setViewport({ width: 1440, height: 720 });
    let file = `${cookies}/${data.gmail.split('@')[0]}-@-init-Gmail.json`
    const navigationPromise = page.waitForNavigation()
    fs.access(file, fs.constants.F_OK | fs.constants.W_OK, async (err) => {
        if (err) {
            console.error(`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
        } else {
            let cookies = JSON.parse(fs.readFileSync(file));
            await page.setCookie(...cookies);
        }
    })
    await page.goto('https://gmail.com')
    await time(3000)
    if (await page.url() == "https://mail.google.com/mail/u/0/#inbox") {
        await time(3000)
        // await page.screenshot({
        //     path: `${path}/${data.gmail.split('@')[0]}-@-AUTO_LOGIN-${data.id_process}.png`
        // });
        // feedback += `${data.gmail.split('@')[0]}-@-AUTO_LOGIN-${data.id_process}.png`
        // await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        const cookiesObject = await page.cookies()
        let NewFileJson = JSON.stringify(cookiesObject)
        fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
            if (err) {
                throw err
            }
        })
    } else {
        // await page.screenshot({
        //     path: `${path}/${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
        // });
        // feedback += `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
        // await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await navigationPromise
        await page.waitForSelector('input[type="email"]')
        await page.click('input[type="email"]')
        await navigationPromise
        await page.type('input[type="email"]', data.gmail, { delay: 100 })
        await page.waitForSelector('#identifierNext')
        await page.click('#identifierNext')
        await time(3000)
        await page.waitForSelector('input[type="password"]')
        await time(3000)
        page.type('input[type="password"]', data.password, { delay: 200 })
        await time(3000)
        page.waitForSelector('#passwordNext')
        await time(3000)
        page.click('#passwordNext')
        await navigationPromise
        await time(10000)
        const cookiesObject = await page.cookies()
        let NewFileJson = JSON.stringify(cookiesObject)
        fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
            if (err) {
                throw err
            }
        })
    }
    return { browser: browser, page: page, feedback: feedback }
}

const createProject = async (data) => {
    let feedback = ''
    console.log(data);
    let obj = await login(data)
    console.log(obj);
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback
    await time(6000)
    try {
        const navigationPromise = page.waitForNavigation()
        await page.goto(`https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid`)
        await navigationPromise
        await time(3000)
        let b = await page.$$('a.button.button-primary')
        console.log(b);
        await time(3000)
        await b[b.length - 1].click()
        console.log('clicked');
        await time(6000)
        // console.log(await page.frames());
        // await page.frames().forEach(e => {
        //     console.log('the name is : ' + e.name());
        // });
        const frame = await page.frames()[await page.frames().length - 1] /*.find(f => f.name() === 'iframe');*/
        try {
            const button = await frame.$('#radio_0');
            await time(3000)
            button.click();
        } catch (error) {
            console.log('Account is confirmed');
        }
        await time(3000)

        let next = await frame.$('button.md-primary.hentest-enable-button.md-button.md-ink-ripple')
        await time(3000)
        next.click();


        await time(3000)
        await frame.type('#input_2', 'test', { delay: 100 })
        await time(3000)

        let submit = await frame.$('button.md-primary.md-button.md-ink-ripple')
        await time(3000)
        submit.click();
        frame.waitForNavigation()
        await time(3000)
        frame.select('#select_4', 'WEB_SERVER')
        // for (const frame of page.mainFrame().childFrames()) {
        //     console.log(await frame.content());
        // }

    } catch (error) {
        console.log(error);
        return
    }
}

let data = {
    "gmail": "hasithjayanath1994@gmail.com",
    "password": "761578412",
    "proxy": "none",
    "isp": "gmail",
    "verification": "pelinolovenak@outlook.com",
    "REFRESH_TOKEN": "1//04-HSw1YTdFBTCgYIARAAGAQSNwF-L9IrZVdDzdB7bhKckRp2XEabv5T4JB_Zkb-ipWt57I5vQw5hVMR0gMqL7KyHTOgZ20VaelM"
}

createProject(data)