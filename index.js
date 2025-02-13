const app = require("express")();
import captureWebsite from 'capture-website';
let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    chrome = require("chrome-aws-lambda");
    puppeteer = require("puppeteer-core");
} else {
    puppeteer = require("puppeteer");
}

app.get("/api", async (req, res) => {
    let options = {};

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        options = {
            args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        };
    }

    try {
        let browser = await puppeteer.launch(options);
        let page = await browser.newPage();
        await page.goto("https://grudov.ru");
        await captureWebsite.file('https://grudov.ru', 'screenshot.png');
        res.send(await page.title());
    } catch (err) {
        console.error(err);
        return null;
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
});

module.exports = app;
