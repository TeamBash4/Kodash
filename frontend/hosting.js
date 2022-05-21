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

function checkAvailibility(type) {
    document.getElementById("statuscheck").src = "link/loader.gif";
    var websiteId = siteURL.value;
    if (type == 455) {
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
            document.getElementById("warn").innerText = "Your website Id mus be between 3 and 30 characters.";
        }
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
        submitBTN.innerText = "Go to Website";
        submitBTN.href = `http://20.239.156.152/${siteURL.value}`;
        submitBTN.id = "hostedLink";

})
    .catch(() => { document.getElementById("warn").innerText = "Failed to host your files"; })
  }
  
/* For Directories */

// dropArea.addEventListener("drop", async function (e) {
//     e.preventDefault();
//     dropArea.classList.remove(hoverClassName);

//     console.log(await getFilesAsync(e));
// });

// async function getFilesAsync(dataTransfer: DataTransfer) {
//     const files: File[] = [];
//     for (let i = 0; i < dataTransfer.items.length; i++) {
//         const item = dataTransfer.items[i];
//         if (item.kind === "file") {
//             if (typeof item.webkitGetAsEntry === "function") {
//                 const entry = item.webkitGetAsEntry();
//                 const entryContent = await readEntryContentAsync(entry);
//                 files.push(...entryContent);
//                 continue;
//             }

//             const file = item.getAsFile();
//             if (file) {
//                 files.push(file);
//             }
//         }
//     }

//     return files;
// }


// function readEntryContentAsync(entry: FileSystemEntry) {
//     return new Promise<File[]>((resolve, reject) => {
//         let reading = 0;
//         const contents: File[] = [];

//         readEntry(entry);

//         function readEntry(entry: FileSystemEntry) {
//             if (isFile(entry)) {
//                 reading++;
//                 entry.file(file => {
//                     reading--;
//                     contents.push(file);

//                     if (reading === 0) {
//                         resolve(contents);
//                     }
//                 });
//             } else if (isDirectory(entry)) {
//                 readReaderContent(entry.createReader());
//             }
//         }

//         function readReaderContent(reader: FileSystemDirectoryReader) {
//             reading++;

//             reader.readEntries(function (entries) {
//                 reading--;
//                 for (const entry of entries) {
//                     readEntry(entry);
//                 }

//                 if (reading === 0) {
//                     resolve(contents);
//                 }
//             });
//         }
//     });
// }

// function isDirectory(entry: FileSystemEntry): entry is FileSystemDirectoryEntry {
//     return entry.isDirectory;
// }

// function isFile(entry: FileSystemEntry): entry is FileSystemFileEntry {
//     return entry.isFile;
// }