function runcode(){
    filename = document.getElementById("filename").value;
    inputCode = document.getElementById("input").value;
    code = document.getElementById("code").value;
    url = `http://35.235.100.105:8600/code?filename=${filename}&codetext=${code}&input=${inputCode}`
    fetch(url, {
        method: 'POST'})
  .then(response => response.json())
  .then(data => 
    
    document.getElementById('codeoutput').innerText = data['output']
    );
}

function sharecode(){
    filename = document.getElementById("filename").value;
    code = document.getElementById("code").value;
    url = `http://35.235.100.105:8600/code?filename=${filename}&codetext=${code}`
    fetch(url, {method:'POST'})
    .then(response => response.json())
    .then(data => 
        document.getElementById('sharelink').innerText = data['link']
        )
}