//vars will be used next iteration.
var activeTab = 0,
	scriptTab = 0;

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.attempt === "new"){
			chrome.runtime.sendMessage({attempt : "received", updateScripts : request.newScripts}, function(response) {
			});
		} else {

		}
	}
);

chrome.browserAction.onClicked.addListener(function(tab) {
	activeTab = tab.id;
	chrome.tabs.executeScript(null, {file: "scripts/global-script-viewer.chrome.min.js"});
	chrome.tabs.reload(activeTab);

	chrome.windows.create({
		url: "scripts.html?active=" + activeTab,
		type: "popup",
		width: 800,
		height: 600
	}, function(cb){
		scriptTab = cb.id;
	});
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
	if(activeTab > 0 && activeTab === tabId){
		if (changeInfo.status === 'loading') {
			chrome.runtime.sendMessage({loading : true}, function(response) {
				if(response.standBy === true){
					chrome.tabs.executeScript(null, {file: "scripts/global-script-viewer.chrome.min.js"});
				}
			});
		}
	}
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	//will be used to determine properly closed.
});

