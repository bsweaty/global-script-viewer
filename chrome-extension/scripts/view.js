var storeData = '',
	storeLoading = '',
	msgNumber  = 0;


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		if(msgNumber === 0){
			storeLoading = document.body.innerHTML;
		}

		msgNumber += 1;

		if (request.attempt === "received"){
			storeData = request.updateScripts;
			document.body.innerHTML = storeData;
			sendResponse({nodesReceived: true});
		} else if(request.loading === true){
			document.body.innerHTML = storeLoading;
			sendResponse({standBy: true});
		}
	}
);