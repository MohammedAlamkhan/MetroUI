// Create a script.js file

// Define a function that will run as soon as the HTML page loads
var applist
window.onload = function() {
    // Your code here

    fetch(Bridge.getAppsURL())
    .then(resp => resp.json())
    .then(resp => {
        // do something with the list of apps
        applist= resp.apps 
        Bridge.showToast(JSON.stringify(resp.apps));
    })
    console.log('The HTML page has finished loading.');
    // You can write any JavaScript code here that you want to run when the page loads.


    var list = document.getElementById("mainAppList");

    // Iterate over the array and create list items
    applist.forEach(function(item) {
        // Create a new list item element
        var li = document.createElement("li");

        li.classList.add("custom-app-item");
        // Set the text content of the list item to the current item in the array
        li.textContent = item.label;

        // Attach an event listener to the list item for the click event
        li.addEventListener("click", function() {
            // Call the onItemClick function when the list item is clicked, passing the item name
            launchApp(item.packageName);
        });


        // Append the list item to the list
        list.appendChild(li);
    });
};

function launchApp(packageName){
    Bridge.requestLaunchApp(packageName)
  }

function getIcon(packageName){
    Bridge.getDefaultAppIconURL(packageName)
}
