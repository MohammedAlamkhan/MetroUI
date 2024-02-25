// Create a script.js file

// Define a function that will run as soon as the HTML page loads
var applist;
var hubSection;
var oldapplist;
document.addEventListener("DOMContentLoaded", getApps);


function getApps() {
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

    oldapplist = applist;

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

   hubSection = {
    "hubs":{
        "title":"Hub Control Demo",
        "sections": [ {
            "title":"All Apps",
            "id":"allapps",
            "items": hublist
            }]
    }
   }
   
   console.log(JSON.stringify(hubSection));
   
  
    

    // You can write any JavaScript code here that you want to run when the page loads.

}

function launchApp(packageName) {
    console.log(">>>>launching " + packageName);
    setTimeout(function() {
        Bridge.requestLaunchApp(packageName);
    }, 1500); // 1000 milliseconds = 1 second
    setTimeout(function() {
        app.currentView.back()
    }, 3500); // 1000 milliseconds = 1 second
}


function getIcon(packageName){
    Bridge.getDefaultAppIconURL(packageName);
}
