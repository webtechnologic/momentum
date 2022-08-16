import playList from './playList.js';

//Clock
const time = document.querySelector('.time');
const dates = document.querySelector('.date');

//Greeting
const greeting = document.querySelector('.greeting');

//Local storage
const name = document.querySelector('.name');

//Background
const body = document.querySelector('body');
let randomNum;

//Slider
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

//Weather
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

//Quote
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');

//Player
const play = document.querySelector('.play');
const playPrevButton = document.querySelector('.play-prev');
const playNextButton = document.querySelector('.play-next');
const audio = new Audio();
let isPlay = false;
let playNum = 0;
let timer;
let activeTrack = 0;

//Playlist
const playListContainer = document.querySelector('.play-list');


//=========================================================================
//Clock
function showTime() {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 60);
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    setTimeout(showTime, 1000);
    showDate();    
    showGreeting();
}
showTime();

function showDate() {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 60);
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentDate = date.toLocaleDateString('en-US', options);
    dates.textContent = currentDate;
}

//Greeting
function showGreeting() {
    const timeDay = ['night', 'morning', 'afternoon', 'evening'];
    const date = new Date();
    date.setMinutes(date.getMinutes() + 60);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    //const time = Number(`${hours}.${minutes}` / 6);
    //greeting.textContent = `Good ${timeDay[Math.floor((time * 100) / 100)]}`
    const num = Number(`${hours}.${minutes}` / 6);
    const time = timeDay[Math.floor((num * 100) / 100)];
    greeting.textContent = `Good ${time}` 
    return time;       
}

//Local storage
function setLocalStorage() {
    localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    if(localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }
}
window.addEventListener('load', getLocalStorage)  

//Background
function getRandomNum() {
    let min = Math.ceil(1);
    let max = Math.floor(20);
    //return Math.floor(Math.random() * (max - min + 1)) + min;
    randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
}
getRandomNum();

function setBg() {
    const timeOfDay = showGreeting();
    const bgNum = randomNum;
    const num = String(bgNum).padStart(2, "0");
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${num}.jpg`;
    img.onload = () => {      
        body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${num}.jpg')`;
    };
}
setBg();

//Slider
function getSlideNext() {
    if(randomNum <= 20){randomNum++}
    if(randomNum == 21){randomNum = 1}
    setBg();    
}
slideNext.addEventListener('click', getSlideNext);

function getSlidePrev() {
    if(randomNum >= 1){randomNum--}
    if(randomNum == 0){randomNum = 20}
    setBg();    
}
slidePrev.addEventListener('click', getSlidePrev);

//Weather
async function getWeather() {  
    weatherIcon.className = 'weather-icon owf';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=c0955a7a8c08b728161179a0fc90d800&units=metric`;
    const res = await fetch(url);
    const data = await res.json(); 
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)} °C`;
    weatherDescription.textContent = data.weather[0].description;  
    wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity} %`;
}
city.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {getWeather()}
});
city.addEventListener('change', getWeather); 

getWeather();

//Quote
async function getQuotes() {  
    const quotes = 'data.json';
    const res = await fetch(quotes);
    const data = await res.json(); 
    let randomQuote = Math.floor(Math.random() * (data.length-1 - 0 + 1)) + 0;
    quote.textContent = `"${data[randomQuote].text}"`;
    author.textContent = `"${data[randomQuote].author}"`;
}    
changeQuote.addEventListener('click', getQuotes);

getQuotes();

//Player
function playAudio() {
    if(!isPlay){
        isPlay = true; 
        infiniteTrack(); 
        audio.src = playList[playNum].src;   
    }
    else{
        isPlay = false;
        audio.pause();
        clearTimeout(timer); 
    }    
}
play.addEventListener('click', playAudio);

function infiniteTrack(){
    let audioLength = Math.round(audio.duration)
    let audioTime = Math.round(audio.currentTime)
    if(audioLength > audioTime){
        audio.play();
        countTrack();        
    }
    if(audioLength - 1 < audioTime ){
        if(playNum < playList.length){playNum++}
        if(playNum == playList.length){playNum = 0}
        audio.src = playList[playNum].src;  
        audio.play();
        activeTrack++
        countTrack();
    }
    timer = setTimeout(infiniteTrack, 1000);
}

function toggleBtn() {
    if(!isPlay){
        play.classList.remove('pause');
    }
    else{
        play.classList.add('pause');        
    }    
}
play.addEventListener('click', toggleBtn);

function playNext() {
    if(isPlay){
        if(playNum < playList.length){playNum++}
        if(playNum == playList.length){playNum = 0}
        audio.src = playList[playNum].src;
        audio.play();
    }    
}
playNextButton.addEventListener('click', playNext);

function playPrev() {
    if(isPlay){
        if(playNum >= 0){playNum--}
        if(playNum < 0){playNum = playList.length-1}
        audio.src = playList[playNum].src;
        audio.play();
    }    
}
playPrevButton.addEventListener('click', playPrev);

//Playlist
function outputPlaylist(){
    for(let i = 0; i < playList.length; i++) {
        playListContainer.append(document.createElement('li'));
        const li = document.querySelectorAll('.play-list li');
        li[i].classList.add('play-item');
        li[i].textContent = playList[i].title;   
    }
}
outputPlaylist();

function countTrack(){
    const li = document.querySelectorAll('.play-list li');
    for(let i = 0; i < playList.length; i++) {
        li[i].classList.remove('item-active');
    }
    if(activeTrack < playList.length ){        
        li[playNum].classList.add('item-active');        
    }
    if(activeTrack == playList.length){
        li[playNum].classList.add('item-active');
        activeTrack = 0;
    }
}