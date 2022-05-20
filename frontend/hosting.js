var siteDuration = 0;
var siteURL = document.getElementById('siteURL');
const apiURL = "http://20.239.156.152:8000"
siteURL.value = randomString(7);

/* Sending Files to Kodash server */
function sendFile(){
    var radios = document.getElementsByName('timeExpire');
    for (var radio of radios)
    {
        if (radio.checked) {
            return radio.value;
        }
    }
}


/* Checking Availability of SiteLink */
checkAvailibility(siteURL)
siteURL.addEventListener('input', checkAvailibility)
console.log(sendFile());
function checkAvailibility(url) {
    document.getElementById("statuscheck").src = "link/loader.gif";
    var websiteId = siteURL.value;
    if (websiteId.length >= 3 && websiteId.length <= 30) {
        setTimeout(async () => {
            console.log(websiteId)
            var checkStatus = await fetch(apiURL + "/isvalid?path=" + websiteId)
            if (checkStatus.status == 200) {
                document.getElementById("statuscheck").src = "./link/available.svg";
                console.log(checkStatus.status)
            } else if (checkStatus.status == 404) {
                document.getElementById("statuscheck").src = "./link/cross.svg";
            } else {
                document.getElementById("statuscheck").src = "./link/loader.gif";
            }

        }, 1000);
    } else {
        alert("Your custom website id must be between 3 to 30 characters.");
    }
}
/* Generating a Random String */
11

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