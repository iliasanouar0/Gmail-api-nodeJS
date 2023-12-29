const fs = require('fs')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())


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
    const browser = await puppeteer.launch({ headless: 'new', args: arg })
    const browserPID = browser.process().pid
    const page = await browser.newPage()
    pidProcess.push({ id_process: data.id_process, pid: browserPID })
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
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-AUTO_LOGIN-${data.id_process}.png`
        });
        feedback += `${data.gmail.split('@')[0]}-@-AUTO_LOGIN-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        const cookiesObject = await page.cookies()
        let NewFileJson = JSON.stringify(cookiesObject)
        fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
            if (err) {
                throw err
            }
        })
    } else {
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
        });
        feedback += `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
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


// const verify = async (data, entity, mode) => {
//     const result = dotenv.config()
//     if (result.error) {
//         throw result.error
//     }
//     let string = result.parsed.SERVER_ENTITY
//     let grantAccess = { entity: string }

//     let details = ''
//     let arg
//     let proxyServer
//     console.log("Verify start: " + data.gmail);
//     if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
//         arg = [
//             '--no-sandbox',
//             '--ignore-certifcate-errors',
//             '--disable-client-side-phishing-detection',
//             '--ignore-certifcate-errors-spki-list',
//             '--disable-setuid-sandbox',
//             '--disable-dev-shm-usage',
//             '--no-first-run',
//             '--no-zygote',
//             '--proxy-bypass-list=*',
//             '--disable-infobars',
//             '--disable-gpu',
//             '--disable-web-security',
//             '--disable-site-isolation-trials',
//             '--enable-experimental-web-platform-features',
//             '--start-maximized'
//         ]
//     } else {
//         console.log('there is proxy');
//         proxyServer = `${data.proxy}`;
//         arg = [
//             '--no-sandbox',
//             `--proxy-server=${proxyServer}`,
//             '--ignore-certifcate-errors',
//             '--disable-client-side-phishing-detection',
//             '--ignore-certifcate-errors-spki-list',
//             '--disable-setuid-sandbox',
//             '--disable-dev-shm-usage',
//             '--no-first-run',
//             '--no-zygote',
//             '--proxy-bypass-list=*',
//             '--disable-infobars',
//             '--disable-gpu',
//             '--disable-web-security',
//             '--disable-site-isolation-trials',
//             '--enable-experimental-web-platform-features',
//             '--start-maximized'
//         ]
//     }
//     console.log("Lunch puppeteer: " + `--proxy-server=${data.proxy}`);
//     const browser = await puppeteer.launch({ headless: 'new', ignoreHTTPSErrors: true, ignoreDefaultArgs: ['--enable-automation', '--disable-extensions'], args: arg })
//     let c = await browser.createIncognitoBrowserContext({ proxyServer: proxyServer })
//     const browserPID = browser.process().pid
//     let page = await c.newPage();
//     pidProcess.push({ id_process: data.id_process, pid: browserPID })
//     await (await browser.pages())[0].close()
//     let feedback = ''


//     try {
//         await page.setDefaultNavigationTimeout(60000)
//         const navigationPromise = page.waitForNavigation({ timeout: 30000 })
//         let file = `${cookies}/${data.gmail.split('@')[0]}-@-init-Gmail.json`
//         fs.access(file, fs.constants.F_OK | fs.constants.W_OK, async (err) => {
//             if (err) {
//                 console.error(`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
//             } else {
//                 let cookies = JSON.parse(fs.readFileSync(file));
//                 await page.setCookie(...cookies);
//             }
//         })
//         console.log(`Goto => https://gmail.com/ : ${data.gmail}, At ${new Date().toLocaleString()}`);
//         await page.goto('https://gmail.com')
//         await time(3000)
//         console.log(await page.url());
//         if (await page.url() == 'https://www.google.com/intl/fr/gmail/about/') {
//             page = await c.newPage();
//             await (await browser.pages())[0].close()
//             await page.goto('https://accounts.google.com/b/0/AddMailService')
//             console.log(await page.url());
//         }
//         if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
//             console.log('verified email : ' + data.gmail + ` , At ${new Date().toLocaleString()}`);
//             await page.screenshot({
//                 path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
//             });
//             feedback += `${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
//             await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//             const countEnter = await page.evaluate(() => {
//                 let html = []
//                 let el = document.querySelectorAll('.bsU')
//                 let elSpan = document.querySelectorAll('.nU.n1 a')
//                 for (let i = 0; i < el.length; i++) {
//                     html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//                 }
//                 return html
//             })
//             await time(4000)
//             if (countEnter.length == 0) {
//                 details += `Entre unread inbox : 0`
//                 await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//             } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
//                 details += `Entre unread inbox : 0`
//                 await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//             } else {
//                 details += `Entre unread inbox : ${countEnter[0].count}`
//                 await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//             }
//             await time(5000)

//             let smart = await page.evaluate(() => {
//                 let s = document.querySelectorAll('.ahj.ai6.Kj-JD-Jh')
//                 if (s.length == 0) {
//                     return false
//                 }
//                 return true
//             })

//             if (smart) {
//                 let ch = await page.$$('.aho')
//                 await ch[1].click()
//                 await time(3000)
//                 await page.waitForSelector('[name="data_consent_dialog_next"]')
//                 await time(3000)
//                 await page.click('[name="data_consent_dialog_next"]')
//                 await time(3000)
//                 await page.waitForSelector('[name="turn_off_in_product"]')
//                 await time(3000)
//                 await page.click('[name="turn_off_in_product"]')
//                 await time(5000)
//                 await page.waitForSelector('[name="r"]')
//                 await time(3000)
//                 await page.click('[name="r"]')
//             }

//             await page.goto('https://mail.google.com/mail/u/0/#inbox')

//             await page.screenshot({
//                 path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
//             });
//             feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
//             await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })

//             const cookiesObject = await page.cookies()
//             let NewFileJson = JSON.stringify(cookiesObject)
//             fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
//                 if (err) {
//                     throw err
//                 }
//             })
//             let st = await page.$$('.Xy')
//             await time(3000)
//             await st[0].click()
//             await time(3000)
//             let bt = await page.$$('.Tj')
//             await time(3000)
//             await bt[0].click()
//             await time(3000)
//             await page.select('.a5p', 'en')
//             await time(3000)
//             await page.waitForSelector('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//             await page.click('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//             await page.close()
//             await browser.close()
//             return feedback
//         }
//         console.log('301 :' + data.gmail);
//         await navigationPromise
//         console.log('303 :' + data.gmail);
//         console.log('passed :' + data.gmail);
//         await page.screenshot({
//             path: `${path}/${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
//         });
//         console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
//         feedback += `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
//         await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//         await page.waitForSelector('input[type="email"]', { timeout: 5000 })
//         await page.click('input[type="email"]')
//         console.log('313 :' + data.gmail);
//         await navigationPromise
//         console.log('315 :' + data.gmail);
//         console.log('passed :' + data.gmail);
//         await page.type('input[type="email"]', data.gmail, { delay: 100 })
//         await page.waitForSelector('#identifierNext')
//         await page.click('#identifierNext')
//         console.log('320 :' + data.gmail);
//         await navigationPromise
//         console.log('322 :' + data.gmail);
//         console.log('passed :' + data.gmail);
//         await time(10000)
//         if (await page.$('[aria-invalid="true"]') != null) {
//             await page.screenshot({
//                 path: `${path}/${data.gmail.split('@')[0]}-@-invalidEmail-${data.id_process}.png`
//             });
//             await page.close()
//             await browser.close()
//             console.log(`invalid email : ${data.gmail}`);
//             feedback += `, ${data.gmail.split('@')[0]}-@-invalidEmail-${data.id_process}.png`
//             await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//             return feedback
//         }
//         console.log('336 :' + data.gmail);
//         await navigationPromise
//         console.log('338 :' + data.gmail);
//         console.log('passed :' + data.gmail);
//         await page.waitForSelector('input[type="password"]', { timeout: 5000 })
//         await time(3000)
//         await page.type('input[type="password"]', data.password, { delay: 200 })

//         await time(5000)
//         await page.waitForSelector('#passwordNext')
//         await time(2000)
//         await page.click('#passwordNext')
//         await time(10000)
//         if (await page.$('[aria-invalid="true"]') != null) {
//             await page.screenshot({
//                 path: `${path}/${data.gmail.split('@')[0]}-@-invalidPass-${data.id_process}.png`
//             });
//             await page.close()
//             await browser.close()
//             console.log(`invalid pass : ${data.gmail}`);
//             feedback += `, ${data.gmail.split('@')[0]}-@-invalidPass-${data.id_process}.png`
//             await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//             return feedback
//         }
//         console.log('360 :' + data.gmail);
//         await navigationPromise
//         console.log('362 :' + data.gmail);
//         console.log('passed :' + data.gmail);
//         await time(3000)
//         console.log(page.url() + ' ' + data.gmail);
//         try {
//             await page.waitForSelector("div[data-is-touch-wrapper=true] button[jsname=bySMBb]", { visible: true, timeout: 25000 })
//             await page.click("div[data-is-touch-wrapper=true] button[jsname=bySMBb]")
//             console.log("stay sigin clicked " + data.gmail)
//             await page.waitForTimeout(5000)
//         } catch {
//             console.log("catch stay sigin " + data.gmail)
//         }
//         await navigationPromise
//         console.log(page.url() + ' * ' + data.gmail);
//         if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
//             console.log('verified email : ' + data.gmail + ` , At ${new Date().toLocaleString()}`);

//             await page.screenshot({
//                 path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
//             });

//             await time(4000)

//             const countEnter = await page.evaluate(() => {
//                 let html = []
//                 let el = document.querySelectorAll('.bsU')
//                 let elSpan = document.querySelectorAll('.nU.n1 a')
//                 for (let i = 0; i < el.length; i++) {
//                     html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//                 }
//                 return html
//             })
//             if (countEnter.length == 0) {
//                 details += `Entre unread inbox : 0`
//                 await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//             } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
//                 details += `Entre unread inbox : 0`
//                 await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//             } else {
//                 details += `Entre unread inbox : ${countEnter[0].count}`
//                 await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//             }
//             feedback += `, ${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
//             await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })


//             let smart = await page.evaluate(() => {
//                 let s = document.querySelectorAll('.ahj.ai6.Kj-JD-Jh')
//                 if (s.length == 0) {
//                     return false
//                 }
//                 return true
//             })

//             if (smart) {
//                 let ch = await page.$$('.aho')
//                 await ch[1].click()
//                 await time(3000)
//                 await page.waitForSelector('[name="data_consent_dialog_next"]')
//                 await time(3000)
//                 await page.click('[name="data_consent_dialog_next"]')
//                 await time(3000)
//                 await page.waitForSelector('[name="turn_off_in_product"]')
//                 await time(3000)
//                 await page.click('[name="turn_off_in_product"]')
//                 await time(5000)
//                 await page.waitForSelector('[name="r"]')
//                 await time(3000)
//                 await page.click('[name="r"]')
//             }

//             await page.goto('https://mail.google.com/mail/u/0/#inbox')

//             await page.screenshot({
//                 path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
//             });
//             feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
//             await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })

//             const cookiesObject = await page.cookies()
//             let NewFileJson = JSON.stringify(cookiesObject)
//             fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
//                 if (err) {
//                     throw err
//                 }
//             })
//             let st = await page.$$('.Xy')
//             await time(3000)
//             await st[0].click()
//             await time(3000)
//             let bt = await page.$$('.Tj')
//             await time(3000)
//             await bt[0].click()
//             await time(3000)
//             await page.select('.a5p', 'en')
//             await time(3000)
//             await page.waitForSelector('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//             await page.click('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//             await page.close()
//             await browser.close()
//             return feedback
//         }
//         await navigationPromise
//         await time(2000)
//         let recovery = await page.$$('.lCoei.YZVTmd.SmR8')
//         await time(2000)
//         await recovery[2].click()
//         await time(2000)
//         page.waitForSelector('#knowledge-preregistered-email-response')
//         await time(2000)
//         await page.type('#knowledge-preregistered-email-response', data.verification, { delay: 200 })
//         await page.screenshot({
//             path: `${path}/${data.gmail.split('@')[0]}-@-verification-${data.id_process}.png`
//         });
//         feedback += `, ${data.gmail.split('@')[0]}-@-verification-${data.id_process}.png`
//         await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//         await time(2000)
//         let confirm = await page.$$('.VfPpkd-Jh9lGc')
//         await time(2000)
//         await confirm[0].click()
//         await navigationPromise
//         await time(10000)
//         if (await page.$('[aria-invalid="true"]') != null) {
//             console.log('invalid verification : ' + data.verification);
//             await page.screenshot({
//                 path: `${path}/${data.gmail.split('@')[0]}-@-invalid-verification-${data.id_process}.png`
//             });
//             feedback += `, ${data.gmail.split('@')[0]}-@-invalid-verification-${data.id_process}.png`
//             await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//             await page.close()
//             await browser.close()
//             return feedback
//         }
//         console.log(page.url());
//         await page.goto("https://mail.google.com/mail/u/0/#inbox")
//         console.log(page.url());
//         if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
//             console.log('verified email : ' + data.gmail + ` , At ${new Date().toLocaleString()}`);
//             await page.screenshot({
//                 path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
//             });
//             feedback += `, ${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
//             await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//             const countEnter = await page.evaluate(() => {
//                 let html = []
//                 let el = document.querySelectorAll('.bsU')
//                 let elSpan = document.querySelectorAll('.nU.n1 a')
//                 for (let i = 0; i < el.length; i++) {
//                     html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//                 }
//                 return html
//             })
//             await time(4000)
//             if (countEnter.length == 0) {
//                 details += `Entre unread inbox : 0`
//                 await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//             } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
//                 details += `Entre unread inbox : 0`
//                 await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//             } else {
//                 details += `Entre unread inbox : ${countEnter[0].count}`
//                 await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//             }

//             let smart = await page.evaluate(() => {
//                 let s = document.querySelectorAll('.ahj.ai6.Kj-JD-Jh')
//                 if (s.length == 0) {
//                     return false
//                 }
//                 return true
//             })

//             if (smart) {
//                 let ch = await page.$$('.aho')
//                 await ch[1].click()
//                 await time(3000)
//                 await page.waitForSelector('[name="data_consent_dialog_next"]')
//                 await time(3000)
//                 await page.click('[name="data_consent_dialog_next"]')
//                 await time(3000)
//                 await page.waitForSelector('[name="turn_off_in_product"]')
//                 await time(3000)
//                 await page.click('[name="turn_off_in_product"]')
//                 await time(5000)
//                 await page.waitForSelector('[name="r"]')
//                 await time(3000)
//                 await page.click('[name="r"]')
//             }

//             await page.goto('https://mail.google.com/mail/u/0/#inbox')

//             await page.screenshot({
//                 path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
//             });
//             feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
//             await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })

//             const cookiesObject = await page.cookies()
//             let NewFileJson = JSON.stringify(cookiesObject)
//             fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
//                 if (err) {
//                     throw err
//                 }
//             })
//             let st = await page.$$('.Xy')
//             await time(3000)
//             await st[0].click()
//             await time(3000)
//             let bt = await page.$$('.Tj')
//             await time(3000)
//             await bt[0].click()
//             await time(3000)
//             await page.select('.a5p', 'en')
//             await time(3000)
//             await page.waitForSelector('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//             await page.click('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//             await page.close()
//             await browser.close()
//             return feedback
//         }
//     } catch (e) {
//         console.log(e.message);
//         console.log("catch error");
//         if (e.message == 'No element found for selector: .a5p') {
//             await time(3000)
//             await page.screenshot({
//                 path: `${path}/${data.gmail.split('@')[0]}-@-English-${data.id_process}.png`
//             });
//             feedback += `, ${data.gmail.split('@')[0]}-@-English-${data.id_process}.png`
//             await time(3000)
//             await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//             await time(3000)
//             await page.close()
//             await browser.close()
//             console.log(feedback);
//             return feedback
//         }
//         await time(3000)
//         await page.screenshot({
//             path: `${path}/${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
//         });
//         feedback += `, ${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
//         await time(3000)
//         await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//         await time(3000)
//         await page.close()
//         await browser.close()
//         console.log(feedback);
//         return feedback
//     }

// }


const getRefreshToken = async (data) => {
    console.log(data);
}


module.exports = {
    getRefreshToken,
    // verify
}

