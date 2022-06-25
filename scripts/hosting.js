// ********************************************** //
//              Hosting Page JS                   //
// ********************************************** //

// ********************************************** //
//           Hosting Page Variables               //
// ********************************************** //

var siteDuration;
const domain = "https://kodash.live"
const apiURL = `https://api.kodash.live`
var siteId = document.getElementById("siteURL");
var siteDuration;
var siteIdStatus = document.getElementById("statuscheck");
var files;
var hostSec = document.getElementById("hostbtn");
var startButton = document.getElementById('start');
var flag;
// ********************************************** //
//           Hosting Page DOM Values              //
// ********************************************** //

window.addEventListener('load', genSiteId)

function genSiteId() {
    console.log("I am in")
    siteId.value = randomString(7);
    checkSiteId();
}
siteId.addEventListener('keyup', checkSiteId);

// Checking the Site ID availability

function checkSiteId() {
    console.log("Checking Site ID");
    siteIdStatus.src = "./assets/loader.gif";
    var websiteId = siteId.value;
    if (websiteId.length >= 3 && websiteId.length <= 30) {
        setTimeout(async () => {
            console.log(websiteId)
            var checkStatus = await fetch(apiURL + "/isvalid?path=" + websiteId)
            if (checkStatus.status == 200) {
                siteIdStatus.src = "./assets/available.svg";
                console.log(checkStatus.status) // check this error
            } else if (checkStatus.status == 404) {
                siteIdStatus.src = "./assets/notAvailable.svg";
            } else {
                siteIdStatus.src = "./assets/loader.gif";
            }
        }, 1000);
    }
}

// Fetching the site duration from user
function getDuration() {
    var getSelectedValue = document.querySelector('input[name="timeExpire"]:checked');
    if (getSelectedValue != null) {
        return getSelectedValue.value;
    } else {
        return "6h";
    }
}
let dropArea = document.getElementById('dragArea');

;
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}
dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
    let dt = e.dataTransfer
    files = dt.files
}

document.getElementById("start").addEventListener('click', startHostNow)

function startHostNow() {
    var currentdate = new Date();
    for (var i = 0; i < files.length; i++) {
        if (files[i].name === "index.html") {
            flag = 1;
        }
    }
    if (flag == 1) {
        startButton.innerText = "Hosting...";
        handleFiles(files)
        var hostedSites = localStorage.getItem("sites");
        if (hostedSites == null) {
            localStorage.setItem("sites", `${siteId.value}$${currentdate.getTime()}`);
        } else {
            console.log(currentdate.getTime());
            hostedSites += `,${siteId.value}$${currentdate.getTime()}`;
            localStorage.setItem("sites", hostedSites);
        }
    } else {
        showerror("index.html file missing.");
    }

    function handleFiles(files) {
        ([...files]).forEach(uploadFile)

    }
}

/////////////////////////////////////////////

document.getElementById("close").addEventListener('click', hideerror);

function showerror(errors)
{
    document.getElementById("errorcontent").innerText = errors;
    document.getElementById("error").style.display = "flex";
    
}

function hideerror(){
    document.getElementById("error").style.display = "none";
}

/* Sending Files to Kodash server */

function uploadFile(file) {
    let formData = new FormData()
    formData.append('file', file)
    var url = `${apiURL}/host?duration=${getDuration()}&path=${siteId.value}`
    fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(() => {
            startButton.remove();
            let hsButton = document.getElementById("hsButton");
            hsButton.href = `${domain}/${siteId.value}`;
            hsButton.style.backgroundColor = "#27ae60";
            hsButton.style.display = "block";
            hsButton.target = "_blank";
        })
        .catch(() => {
            console.log("Failed!")
        })

}

// ********************************************** //
// Get Random String
// ********************************************** //

function randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}


// ********************************************** //
//                 Click to Upload                //
// ********************************************** //

const dragEl = document.getElementById('dragArea');
const inputFileEl = document.getElementById('inputFile');

dragEl.addEventListener('click', () => inputFileEl.click());

inputFileEl.addEventListener('change', ()=>{
    files = inputFileEl.files;
    console.log(files);
});