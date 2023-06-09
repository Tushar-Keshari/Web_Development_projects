const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userConatiner = document.querySelector(".weather-container");
const grantAccessConatiner = document.querySelector(".grant-locationContainer");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessBtn = document.querySelector("[data-grantAccess]");




const Api_key = "2a34605c6a6121f5950789c9abd58650";
let currentTab = userTab;
currentTab.classList.add("current-tab");



grantAccessBtn.addEventListener('click',geolocation);

function geolocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert box support avaliable 
        // x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position){
    const userCoordinates = {
        "lat" : position.coords.latitude,
        "lon" : position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    // console.log(sessionStorage);
    fetchUserWeatherInfo(sessionStorage);
}

function renderWeatherInfo(weatherInfo){
    //UI display content
    const cityName = document.querySelector("[data-cityName]");
    const cntryIcon = document.querySelector("[data-country-icon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-Temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouidness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);

    //featch data from
    cityName.innerText = weatherInfo?.name;
    cntryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windSpeed.innerText =  `${weatherInfo?.wind?.speed} m/sec`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    clouidness.innerText = `${weatherInfo?.clouds?.all} %`;
    
}

async function fetchUserWeatherInfo(coordinates){
    console.log(coordinates);
    // const {lat, lon} = coordinates;

    const lat = coordinates.lat;
    const lon = coordinates.lon;
    //make grant container invisible
    grantAccessConatiner.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=2a34605c6a6121f5950789c9abd58650`);
        const data = await response.json();
        console.log(data);

        loadingScreen.classList.remove("active");
        console.log("heyyyy");
        userConatiner.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
        console.error("Error found");
    }
}

function getfromsessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessConatiner.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function switchTab(clickedTab){
    if(clickedTab !== currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            searchForm.classList.add("active");
            userInfoContainer.classList.remove("active");
            grantAccessConatiner.classList.remove("active"); 
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.add("active");
            getfromsessionStorage();
        }
    }
}
//start here 
userTab.addEventListener("click",() => {
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessConatiner.classList.remove("active");
    // console.log("heyy i am here ");
    try{
        // console.log("heyy i am here ");
        let content = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2a34605c6a6121f5950789c9abd58650`);
        // console.log("heyy i am here ");
        const data = await content.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
        console.error("ERROR FOUND");
    }
}
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
});



