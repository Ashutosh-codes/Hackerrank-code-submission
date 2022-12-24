const puppeteer = require("puppeteer");
const loginLink = "https://www.hackerrank.com/auth/login";
const email = "";
const passwd = "";
let codeObj = require("./codes");

(async function(){
    try{
        let browserInstance = await puppeteer.launch({
            headless : false,
            args: ['--start-maximized'],
            defaultViewport : null
        }); 

        let newTab = await browserInstance.newPage();
        await newTab.goto(loginLink);
        await newTab.type("input[id='input-1']", email, {delay: 50});
        await newTab.type("input[type='password']", passwd, {delay: 50});
        await newTab.click("button[data-analytics='LoginPassword']", {delay : 50});
        await waitAndClick("div[data-automation='algorithms']", newTab);
        await waitAndClick("input[value='warmup']", newTab);
        let allChallenges = await newTab.$$(".content--list_body", {delay : 50});
        console.log(allChallenges.length);
        await questionSolver(newTab, allChallenges[0], codeObj.answers[0]);
    }catch(err){
        console.log(err);
    }
})();


async function waitAndClick(selector, cPage){
    await cPage.waitForSelector(selector);
    let selectorClicked = cPage.click(selector);
    return selectorClicked; 
}

async function questionSolver(page, question, answer){
    await question.click();
    await page.waitForTimeout(3000);
    await waitAndClick("input[type='checkbox']", page);
    await page.waitForSelector('textarea.custominput');
    await page.type('textarea.custominput', answer, {delay : 10});
    await page.keyboard.down("Control");
    await page.keyboard.down('A', {delay: 50});
    await page.keyboard.down('X', {delay: 50});
    await page.keyboard.up("Control");
    await waitAndClick(".monaco-editor.no-user-select.vs", page);
    await page.keyboard.down("Control");
    await page.keyboard.down('A', {delay: 50});
    await page.keyboard.down('V', {delay: 50});
    await waitAndClick('.hr-monaco-submit', page);
}
