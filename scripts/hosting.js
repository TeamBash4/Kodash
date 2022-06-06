var siteDuration = "4d";
var siteURL = document.getElementById('siteURL');
const apiURL = "http://20.239.156.152:8000"
siteURL.value = randomString(7);
var siteFiles = document.getElementById("filepicker")
const submitBTN = document.getElementById("start")

// submitBTN.addEventListener('click', checkAvailibility(456));

/* Sending Files to Kodash server */

submitBTN.addEventListener('click', uploadSite);

function uploadSite(){
    handleFiles(siteFiles.files)
}

/* Checking Availability of SiteLink */
checkAvailibility(455)
siteURL.addEventListener('input', checkAvailibility)

function checkAvailibility() {
    document.getElementById("statuscheck").src = "link/loader.gif";
    var websiteId = siteURL.value;
        if (websiteId.length >= 3 && websiteId.length <= 30) {
            setTimeout(async () => {
                console.log(websiteId)
                var checkStatus = await fetch(apiURL + "/isvalid?path=" + websiteId)
                if (checkStatus.status == 200) {
                    document.getElementById("statuscheck").src = "./link/available.svg";
                    console.log(checkStatus.status) // check this error
                } else if (checkStatus.status == 404) {
                    document.getElementById("statuscheck").src = "./link/notAvailable.svg";
                } else {
                    document.getElementById("statuscheck").src = "./link/loader.gif";
                }
            }, 1000);
        }
    }

/* Generating a Random String */

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


let dropArea = document.getElementById('dragArea')

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    
    dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
}
dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
    ([...files]).forEach(uploadFile)
  }
  function uploadFile(file) {
    let formData = new FormData()
    formData.append('file', file)
    var url = `${apiURL}/host?duration=${siteDuration}&path=${siteURL.value}`
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then(() => { 
        var hostedSites = localStorage.getItem("sites");
        if (hostedSites == null) {
            localStorage.setItem("sites", siteURL.value);
        } else {
            localStorage.setItem("sites", hostedSites + "," + siteURL.value);
        }
        submitBTN.innerText = "Go to Website";
        submitBTN.href = `http://20.239.156.152/${siteURL.value}`;
        submitBTN.id = "hostedLink";

})
    .catch(() => { document.getElementById("warn").innerText = "Failed to host your files"; })
  }