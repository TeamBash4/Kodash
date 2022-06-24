// ================================================================= //
// ============JavaScript code for The Kodash Code Editor=========== // 
// ================================================================= //

// Share Button Overlay for showing share link //

const overlay = document.querySelector(".overlay");
const cross = document.querySelector(".cross");
const run = document.querySelector(".run");
const share = document.querySelector(".share");
const shareOverlay = document.querySelector(".shareOverlay");

const hideOverlay = function(){
    overlay.classList.toggle("hide");
}

run.addEventListener("click", hideOverlay);
cross.addEventListener("click", hideOverlay);

const sharelink = function(){
    shareOverlay.classList.toggle("desk-Hide");
}

share.addEventListener('click', sharelink);

// Interaction with Backend //

// *************************** //
//     Kodash API Variables    //
// *************************** //

const api = "https://api.kodash.live"
const domain = "https://kodash.live"
var codelang;
var langversion;
var runcode = 0;
// Get the current code from the backend //

function getCode() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let codeid = params.id;
    let apiURl = `${api}/retreive?id=${codeid}`;
    fetch(apiURl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let filename = data.content[0].filename;
            let code = data.content[0].content;
            document.getElementById("filename").innerHTML = filename;
            document.getElementById("code-editor").innerHTML = code;
            document.getElementById("codeLink").value = `${domain}/editor.html?id=${codeid}`;
        }
        )
        .catch(error => console.log(error));
}

//  Check code id validity //



function validId(codeid){
    fetch(`${api}/isValidID?id=${codeid}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.status == 200){
                return 200;
            }
            else{
                return 404;
            }
        })
}

document.getElementById("copybtn").addEventListener("click", copyShareLink);

// Copy share link
function copyShareLink()
{
    document.getElementById("codeLink").select();
    document.execCommand("copy");
}

// Store the current code to the backend //

document.getElementById("sharebtn").addEventListener("click", sendCode);

function sendCode() {
    let codeid = randomString(7);
    if (validId(codeid) == 200) {
    let filename = document.getElementById("filename").innerHTML;
    let code = document.getElementById("code-editor").innerHTML;
    let apiURl = `${api}/store?id=${codeid}&filename=${filename}`;
    console.log(codeid, filename, apiURl)
    fetch(apiURl, {
        method: 'POST',
        body: code
    })
        .then(() => {
            console.log("Code stored");
            document.getElementById("codeLink").value = `${domain}/editor.html?id=${codeid}`;

        })
        .catch(error => console.log(error));
}
else{
    console.log("Code ID already exists");
    sendCode();

}}
// Function to generate Random ID for storing code //

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
document.getElementById("filename").addEventListener("keyup", langdetection);
function langdetection(){
    let codefile = document.getElementById("filename").value;
    if(codefile.endsWith(".py")){
        langversion = "3.10.0";
        codelang = "python";
    }
    else if(codefile.endsWith(".js")){
        langversion = "16.3.0";
        codelang = "javascript";
    }
    else if(codefile.endsWith(".java")){
        langversion = "15.0.2";
        codelang = "java";
    }
    else if(codefile.endsWith(".c")){
        langversion = "10.2.0";
        codelang = "c";
    }
    else if(codefile.endsWith(".cpp")){
        langversion = "10.2.0";
        codelang = "cpp";
    }
    else if(codefile.endsWith(".html")){
        langversion = "8.0.2";
        codelang = "html";
    }
    else if(codefile.endsWith(".css")){
        codelang = "css";
    }
    else if(codefile.endsWith(".php")){
        langversion = "8.0.2";
        codelang = "php";
    }
    else if(codefile.endsWith(".rb")){
        langversion = "3.0.1";
        codelang = "ruby";
    }
    else if(codefile.endsWith(".lua")){
        langversion = "5.4.2";  
        codelang = "lua";
    }
    else if(codefile.endsWith(".swift")){
        langversion = "5.3.3";
        codelang = "swift";
    }
    else if(codefile.endsWith(".kt")){
        langversion = "1.4.31";
        codelang = "kotlin";
    }
    else if(codefile.endsWith(".go")){
        langversion = "1.16.2";
        codelang = "go";
    }
    else if(codefile.endsWith(".rs")){
        langversion = "1.50.0";
        codelang = "rust";
    }
    else
    {
        langversion = "invalid";
        codelang = 'document';
    }
    document.getElementById('langlogo').src = `./assets/logos/${codelang}/${codelang}.svg`;
}


// *************************** //
//     Code Run and Compile    //
// *************************** //

document.getElementById("run").addEventListener("click", runCode);

function runCode()
{
    runcode = 1;
    langdetection()
    let code = document.getElementById("code-editor").value;
    let filename = document.getElementById("filename").value;
    let codeinput = document.getElementById("output").value;
    let apiURL = "https://emkc.org/api/v2/piston/execute";
    console.log(typeof(codelang));
    if (codelang != "document" && codelang != "css")
    {
        let body = {
            "language": codelang,
            "version": langversion,
            "files": [
                {
                    "name": filename,
                    "content": code
        }],
        'stdin' : codeinput
        }
        fetch(apiURL, {
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById("intitle").innerText = "Output";
                console.log(data);
                if (data.run.stdout == '')
                {
                 document.getElementById("output").value = data.run.stderr;   
                }
                else{
                 document.getElementById("output").value = data.run.stdout;
                }}
            )
            .catch(error => console.log(error));
    }
        
}
document.getElementById("code-editor").addEventListener('click', () => {
    if (runcode == 1){
        document.getElementById("output").value = '';
        document.getElementById("intitle").innerText = "Input";
        runcode = 0;
    }
    
})

/*

===========  ============   """""""""   ==        ==
    ""       ==             =       =   = =     =  =
    ""       ==             =       =   =   =  =   =
    ""       ============   =========   =    ==    =
    ""       ==             =       =   =          =
    ""       ==             =       =   =          =
    ""       ============   =       =   =          =


*/