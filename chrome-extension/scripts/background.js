chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.attempt === "new"){
			chrome.runtime.sendMessage({attempt : "received", updateScripts : request.newScripts}, function(response) {
			});
		}else{
			chrome.runtime.sendMessage({loading : true}, function(response) {

		});
		}
		
	}
);

chrome.browserAction.onClicked.addListener(function(tab) {
 	chrome.tabs.executeScript(null, {file: "scripts/global-script-viewer.chrome.min.js"});

	chrome.windows.create({
		url: "scripts.html",
		type: "popup",
		width: 800,
		height: 600
	});
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	if (changeInfo.status === 'complete') {
		
	}
});

