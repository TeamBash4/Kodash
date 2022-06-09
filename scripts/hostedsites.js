function loadSites(){
    var sites = localStorage.getItem("sites").split(",");
    var sitelist;
    var domain = "https://kodash.live"
    for(var i = 0; i < sites.length; i++){
    sitelist += `<div class="hosted-site">
    <a href="${domain}${sites[i]}"><div class="name">
        <p class="sl">1.</p>
        <p class="site-title">${domain}${sites[i]}</p>
    </div></a>
    <div class="csd-btn">
        <img src="./assets/copy.svg">
        <a href="${domain}${sites[i]}"><img src="./assets/share.svg"></a>
        <img src="./assets/delete.svg">
        <span class="time">Hosted 3 days ago </span>
    </div>
</div>`;
}
document.getElementById("hosted-sites").innerHTML = sitelist;
}

window.addEventListener('load', loadSites)