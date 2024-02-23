// Create a script.js file

// Define a function that will run as soon as the HTML page loads
var applist;
document.addEventListener("DOMContentLoaded", function() {
    // Your code here
    
    fetch(Bridge.getAppsURL())
    .then(resp => resp.json())
    .then(resp => {
        // do something with the list of apps
        applist= resp.apps 
        applist.sort((a, b) => {
            const labelA = a.label.toLowerCase();
            const labelB = b.label.toLowerCase();
            if (labelA < labelB) {
                return -1;
            }
            if (labelA > labelB) {
                return 1;
            }
            return 0;
        });
    })
    

    let i=0
    applist.forEach(element => {
        applist[i]["iconSrc"]= getIcon(element.packageName) 
        i++
    });


    let hublist=[];
    applist.forEach(element => {
        hublist.push(
            {
                "type":"tile detail",
                "title":element.label,
                "description": element.packageName,
            }
        )
    });

   let hubSection = {
    "hubs":{
        "title":"Hub Control Demo",
        "sections": [ {
            "title":"All Apps",
            "id":"allapps",
            "items": hublist
            }]
    }
   }
   
   
  
    

    // You can write any JavaScript code here that you want to run when the page loads.

});

function launchApp(packageName){
    Bridge.requestLaunchApp(packageName);
}

function getIcon(packageName){
    Bridge.getDefaultAppIconURL(packageName);
}
