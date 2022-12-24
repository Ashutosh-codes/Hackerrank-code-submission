const puppeteer = require("puppeteer");
let cTab;
let link = "https://www.youtube.com/playlist?list=PLW-S5oymMexXTgRyT3BWVt_y608nt85Uj";
const fs = require("fs");
const pdf = require("pdfkit");
(async function(){
    try {
        let browserOpen = puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        })

        let browserInstance = await browserOpen;
        let allTabs = await browserInstance.pages();
        cTab = allTabs[0];
        await cTab.goto(link);
        await cTab.waitForSelector('yt-formatted-string#text');
        let name = await cTab.evaluate(function(select){return document.querySelector(select).innerText}, 'yt-formatted-string#text');
        // await cTab.waitForSelector(".byline-item.style-scope.ytd-playlist-byline-renderer");
        let data = await cTab.evaluate(getData, ".byline-item.style-scope.ytd-playlist-byline-renderer");
        console.log(name, data.noOfVideos,  data.noOfViews);
        let TotalVideos = data.noOfVideos.split(" ")[0];
        console.log(TotalVideos);

        let currentVideos = await getCvideosLength();
        console.log(currentVideos);

        while(TotalVideos - currentVideos >= 30){
            await scrollToBottom();
            currentVideos = await getCvideosLength();
        }

        let finalList = await getStats();
        let pdfDoc = new pdf;
        pdfDoc.pipe(fs.createWriteStream('play.pdf'));
        pdfDoc.text(JSON.stringify(finalList));
        pdfDoc.end();
        browserInstance.close();
    } catch (error) {
        console.log(error);
    }
})();

async function scrollToBottom(){
    await cTab.evaluate(goToBottom)
    function goToBottom(){
        window.scrollBy(0, window.innerHeight);
    }
}

function getData(selector){
    let allElems = document.querySelectorAll(selector);
    let noOfVideos = allElems[0].innerText
    let noOfViews = allElems[1].innerText
    
    return {
        noOfVideos,
        noOfViews
    }
}

async function getCvideosLength(){
    let length = await cTab.evaluate(getLength, "ytd-thumbnail#thumbnail");
    return length;
}

function getLength(durationSelect){
    let durationElement = document.querySelectorAll(durationSelect);
    return durationElement.length;
}

async function getStats(){
    let list = await cTab.evaluate(getNameAndDuration, "a#video-title", "span[id='text']");
    return list;
}

function getNameAndDuration(videoSelector, durationSelector){
    let videoElem = document.querySelectorAll(videoSelector);
    let durationElem = document.querySelectorAll(durationSelector);
    console.log(videoElem);
    let currentList = []
    for(let i=0; i<durationElem.length; i++){
        let videoTitle = videoElem[i].innerText;
        let duration = durationElem[i].innerText;
        currentList.push({videoTitle, duration});
    }

    return currentList;
}