var storeData = '';

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.attempt === "received"){
			console.log("received");
			storeData = request.updateScripts;
			document.body.innerHTML = storeData;
			sendResponse({nodesReceived: true});
		}else if(request.loading === true){
			console.log("loading");
			document.body.innerHTML = '<h1>Scripts Loading</h1><p>If scripts failed to load, please submit a bug to github.</p><p>Please note that sites like Gmail, Facebook, and others that rely on iFrames and similar technology may cause this extension not to work.</p>';
			chrome.runtime.sendMessage({waiting : "finished"}, function(response) {
				
			});
		}
	}
);