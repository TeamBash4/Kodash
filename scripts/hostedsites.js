var sitesdb = localStorage.getItem("sites");
var sitelist = '';
var sites;
var domain = 'https://kodash.live/';

function loadSites() {
	console.log("hi")
	if (sitesdb === null) {
		console.log("inside");
		document.getElementById("hosted-sites").innerHTML = `<img src="./assets/cat.png" style="width:250px;"><p style="display:flex;">You haven't hosted any website yet.</p>`;
	}
    else{
        sites = sitesdb.split(',')

        for(var i = 0; i < sites.length; i++)
        {
            if (sites[i] != ''){
            var date = sites[i].split('$')[1]
            console.log(date);
            var current = new Date();
            var days = Math.round((current.getTime() - date)/(1000 * 60 * 60 * 24));
            console.log(days);
            var timestring = ``;
            if (days <1)
            {
                timestring = `Today`;
            }
            else
            {
                timestring = `${days} days`;
            }
        
            sitelist += `<div class="hosted-site">
            <div class="name">
                <p class="sl">${i+1}.</p>
                <p class="site-title"><a href="${domain}${sites[i].split('$')[0]}">${domain}${sites[i].split('$')[0]}</a></p>
            </div>
            <div class="csd-btn">
                <div>
                    <img src="assets/copy.svg" onclick="copylink('${sites[i].split('$')[0]}')" id="${sites[i].split('$')[0]}">
                    <a href="intent:#Intent;action=android.intent.action.SEND;type=text/plain;S.android.intent.extra.TEXT=${sites[i].split('$')[0]};S.android.intent.extra.SUBJECT=Hey, I hosted this static website on Kodash.;end"><img src="assets/share.svg" class="share"></a>
                    <img src="assets/delete.svg" onclick="deletesite('${sites[i].split('$')[0]}')">
                </div>
                <span class="time">${timestring}</span>
            </div>
        </div>`;
    }
        }
        document.getElementById("hosted-sites").innerHTML = sitelist;
    }
}

window.addEventListener("load", loadSites)

function deletesite(siteid)
{
    let url = `https://api.kodash.live/delete?path=${siteid}`
    fetch(url, {method : 'DELETE'})
    .then(response => response.json)
    .then(data => {
        var sitedl = localStorage.getItem("sites");
        var sitesls = sitedl.split(",");
        for(var j =0; j<sitesls.length; j++)
        {
            if (sitesls[j].includes(siteid))
            {
                console.log(sitesls[j]);
                localStorage.setItem("sites", sitedl.replace(sitesls[j], ''))
                location.reload();

            }
        }
        
        alert(`Deleted ${siteid} successfully.`)
    }

    )
}

function copylink(siteid){
    document.getElementById(siteid).select();
    document.execCommand("copy;")
}