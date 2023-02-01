const form = document.querySelector("form");
const input = document.querySelector("form input");
const msgSpan= form.querySelector(".msg");

// .class .class =======>>>>>>> (parent child ilişkisi var)

//.class.class =========>>>>>>>

const list = document.querySelector(".container .cities")

localStorage.setItem( "apiKey" ,EncryptStringAES("fb339a4202829033d52628993df350ff") )
// console.log(apiKey);

// localStorage.setItem("apiKey" ,"EgPnXGtC92PbFbHEfnSy22poH3TIKOjqawZbBM+rbuvZ/Zcv1mK6gA7MqMUAbuR+")

//html inline assign, addEventListener, onclick, setAttribute 
form.addEventListener("submit", (e) => {
    e.preventDefault();
    getWeatherDataFromApi();
    form.reset();
    //input.value = "";
    //target vs. currentTarget
    //e.currentTarget.reset();
});

const getWeatherDataFromApi = async () => {
    const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
    console.log(apiKey);
    const cityName = input.value;
    const units = "metric";
    const lang = "tr";

    //http request url(endpoint)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`;

    try {
        // const response = await fetch(url).then(response=>response.json());

        const response = await axios(url);
        console.log(response);

        //obj. destructuring
        const { main, name, sys, weather } = response.data;

        const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

        const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;
        console.log(response);

        const cityNameSpans = list.querySelectorAll("span");
        //filter, map, reduce, forEach ==> array
        //forEach => nodeList
        if (cityNameSpans.length > 0) {
            const filteredArray = [...cityNameSpans].filter(span => span.innerText == name);
            if (filteredArray.length > 0) {
                msgSpan.innerText = `You already know the weather for ${name}, Please search for another city 😉`;
                setTimeout(() => { msgSpan.innerText = "" }, 5000);
                return;
            }
        }
        const createdLi = document.createElement("li");
        createdLi.classList.add("city");
        createdLi.innerHTML =
            ` <h2 class="city-name" data-name="${name},${sys.country}">
                <span>${name}</span>
                <sup class="sys">${sys.country}</sup>
          </h2>
          <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
          <figure>
                <img class="city-icon" src="${iconUrl}">
                <figcaption>${weather[0].description}</figcaption>
          </figure>`;
        //append vs. prepend
        list.prepend(createdLi);

        

        //Capturing => parent to child
        // list.addEventListener("click", (e) => {
        //     alert("List clicked!");
        // });
        //Bubbling => child to parent
     

        // document.querySelector("figure").addEventListener("click", (e)=>{
        //     alert("figure element clicked");
        // });

    }
    catch (error) {
        //error logging
        //postErrorLog("weather.js", "getWeatherDataFromApi", date, error);
        msgSpan.innerText = "City not found!";
        setTimeout(() => { msgSpan.innerText = "" }, 5000);
    }

}