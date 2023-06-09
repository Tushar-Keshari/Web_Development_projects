const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBnt = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatorBtn = document.querySelector(".generatePassword");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "!@#$%^&*()_+-=`~{[}]';?<>/*";

let password ="";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color to gray 
//set password length 
function shufflePassword(array){
    //fisher yate methods
    for(let i=array.length - 1;i>0;i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[j];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => {str += el});
    return str;
}

function handleSlider(){   //password length ko ui par reflect karwate hai
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //
}
function setIndicator(color){
    indicator.style.backgroundColor = color;

}
function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;  //generation of random number 

}
function getnerateRandomNumber(){
    return getRandomInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65,91));
}
function generateSymbols(){
    const randNum =  getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}
function calcStrength(){
    let hasUpper = false;
    let hasLower = false ;
    let hasSymbol = false;
    let hasNumber = false;

    if(upperCaseCheck.checked) hasUpper=true;
    if(lowerCaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNumber=true;
    if(symbolCheck.checked) hasSymbol=true;

    if(hasUpper && hasLower && (hasSymbol || hasNumber) && passwordLength >=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasSymbol || hasNumber) && passwordLength >= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){   //to copy to clipboard 
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    //to make spam visible
    copyMsg.classList.add("active");

    setTimeout (() => {
        copyMsg.classList.remove("active");
    },2000);
}
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });

    //condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}


allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
});

copyBnt.addEventListener('click', ()=>{
    if(passwordDisplay.value){  // if(password.length > 0)
        copyContent();
    }
})

generatorBtn.addEventListener('click', ()=>{
    //none of the check box selected
    if(checkCount <=0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //let start the journy 
    password = "";
    console.log("password set");
    //lets put the stuff mentioned 

    // if(upperCaseCheck.checked){
    //     password += generateUppercase();
    // }
    // if(lowerCaseCheck.checked){
    //     password += generateLowercase();
    // }
    // if(numberCheck.checked){
    //     password += getnerateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password += generateSymbols();
    // }

    let funcArr = [];
    if(upperCaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowerCaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(numberCheck.checked){
        funcArr.push(getnerateRandomNumber);
    }
    if(symbolCheck.checked){
        funcArr.push(generateSymbols);
    }
    console.log ("function pushed");

    //compulaory addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }
    console.log("addition done ");
    for(let i=0;i<passwordLength - funcArr.length;i++){
        let randIndex = getRandomInteger(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    console.log("shuffle done");
    //show in ui
    passwordDisplay.value = password;
    console.log("display done ")
    //cals strength
    calcStrength();


});