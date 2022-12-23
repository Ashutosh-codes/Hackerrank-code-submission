const puppeteer = require("puppeteer");
const loginLink = "https://www.hackerrank.com/auth/login";
const email = "";
const passwd = "";
let codeObj = require("./codes");
let page;

let browserOpen = puppeteer.launch({
    headless : false,
    args: ['--start-maximized'],
    defaultViewport : null
});

browserOpen.then(function(browserObj){
    let browserOpenPromise = browserObj.newPage();
    return browserOpenPromise;
}).then(function(newTab){
    page = newTab;
    let hackerRankOpenPromise = newTab.goto(loginLink);
    return hackerRankOpenPromise;
}).then(function(){
    let emailIsEntered = page.type("input[id='input-1']", email, {delay: 50});
    return emailIsEntered;
}).then(function(){
    let passwdIsEntered = page.type("input[type='password']", passwd, {delay: 50});
    return passwdIsEntered;
}).then(function(){
    let loginButtonClicked = page.click("button[data-analytics='LoginPassword']", {delay : 50});
    return loginButtonClicked;
}).then(function(){
    let algoButtonClicked = waitAndClick("div[data-automation='algorithms']", page);
    return algoButtonClicked;
}).then(function(){
    let impleButtonClicked = waitAndClick("input[value='implementation']", page);
    return impleButtonClicked;
}).then(function(){
    let waitFor3Seconds =  page.waitForTimeout(3000);
    return waitFor3Seconds;
}).then(function(){
    let impleButtonClicked = waitAndClick("input[value='implementation']", page);
    return impleButtonClicked;
}).then(function(){
    let waitFor3Seconds =  page.waitForTimeout(3000);
    return waitFor3Seconds;
}).then(function(){
    let warmupButtonClicked = waitAndClick("input[value='warmup']", page);
    return warmupButtonClicked;
}).then(function(){
    let waitFor3Seconds =  page.waitForTimeout(3000);
    return waitFor3Seconds;
}).then(function(){
    let allChallengePromise = page.$$(".content--list_body", {delay : 50});
    return allChallengePromise;
}).then(function(questionArr){
    console.log("Number of questions", questionArr.length);
    let questionWillBeSolved = questionSolver(page, questionArr[0], codeObj.answers[0]);
    return questionWillBeSolved;
})


function waitAndClick(selector, cPage){
    return new Promise(function(resolve, reject){
        let waitForModelPromise = cPage.waitForSelector(selector);
        waitForModelPromise.then(function(){
            let clickModel = cPage.click(selector);
            return clickModel;
        }).then(function(){
            resolve();
        }).catch(function(err){
            console.log(err);
            reject();   
        })
    })
}

function questionSolver(page, question, answer){
    return new Promise(function(resolve, reject){
        let questionWillBeClicked = question.click();
        questionWillBeClicked.then(function(){
            let waitFor3Seconds =  page.waitForTimeout(3000);
            return waitFor3Seconds;
        }).then(function(){
            let checkboxClicked = waitAndClick("input[type='checkbox']", page);
            return checkboxClicked;
        }).then(function(){
            return page.waitForSelector('textarea.custominput', page);
        }).then(function(){
            return page.type('textarea.custominput', answer, {delay : 10});
        }).then(function(){
            let CtrlIsPressed = page.keyboard.down("Control");
            return CtrlIsPressed;
        }).then(function(){
            let AIsPressed = page.keyboard.down('A', {delay: 50});
            return AIsPressed;
        }).then(function(){
            let XIsPressed = page.keyboard.down('X', {delay: 50});
            return XIsPressed;
        }).then(function(){
            let CtrlIsUnpressed = page.keyboard.up("Control");
            return CtrlIsUnpressed;
        }).then(function(){
            let mainEditorFocus = waitAndClick(".monaco-editor.no-user-select.vs", page);
            return mainEditorFocus;
        }).then(function(){
            let CtrlIsPressed = page.keyboard.down("Control");
            return CtrlIsPressed;
        }).then(function(){
            let AIsPressed = page.keyboard.down('A', {delay: 50});
            return AIsPressed;
        }).then(function(){
            let VIsPressed = page.keyboard.down('V', {delay: 50});
            return VIsPressed;
        }).then(function(){
            let submitIsClicked = waitAndClick('.hr-monaco-submit', page);
            return submitIsClicked;
        })
    })
}