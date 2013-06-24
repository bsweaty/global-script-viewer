	/**
 * Global Script Viewer v1.0
 * https://github.com/bsweat/global-script-viewer
 * 
 * © 2013, Brian Sweat
 * http://bsweat.com
 * 
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */

(function(){

	var allScripts = document.getElementsByTagName('script'),
		chromeStart = true,
		wrapper = document.createElement('div'),
		wrapStyle = wrapper.style,
		css = '',
		url = window.location.hostname,
		tabLoc = window.location,
		style = document.createElement('style'),
		head = document.getElementsByTagName('head')[0];

	function htmlEscape(str) {

		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	var updateWindow = function(lastLength, lastAdded, lastRemoved){
		return setTimeout(function(){
			var scripts = document.createDocumentFragment(),
				listWrap = document.createElement('div'),
				headList = document.createElement('ul'),
				headTitle = document.createElement('h2'),
				bodyList = document.createElement('ul'),
				bodyTitle = document.createElement('h2'),
				deletedList = document.createElement('ul'),
				deletedTitle = document.createElement('h2'),
				info = document.createElement('div'),
				total = document.createElement('h2'),
				ref = document.createElement('h3'),
				counts = document.createElement('h3'),
				inline = 0,
				files = 0,
				third = 0;

			total.innerHTML = 'Number of Scripts: <span>' + allScripts.length + '.</span>';
			ref.innerHTML = tabLoc;
			headTitle.innerHTML = 'Head Scripts';
			bodyTitle.innerHTML = 'Body Scripts';
			deletedTitle.innerHTML = 'Removed Scripts';
			listWrap.id = 'script-lists';
			headList.id = 'head-list';
			headList.appendChild(headTitle);
			bodyList.appendChild(bodyTitle);
			deletedList.appendChild(deletedTitle);

			for(var i=0; i<allScripts.length; i++){

				var li = document.createElement('li'),
					div = document.createElement('div'),
					scriptLocation = allScripts[i].parentNode.nodeName,
					title = document.createElement('h3'),
					count = document.createElement('span'),
					inserted = false,
					insertTime = '';

				li.className = 'script';

				if(insertedScripts.length){

					for(var j = 0; j < insertedScripts.length; j++){
						if(insertedScripts[j].node.isEqualNode(allScripts[i])){

							inserted = true;
						}
					}

					if(inserted === true){
						insertTime = jStatus;
						li.className = li.className +  ' inserted';
					}
				}

				if(allScripts[i].src){
					
					var fileName = (allScripts[i].src.match(/[^/]+$/g) !== null) ? (allScripts[i].src.match(/[^/]+$/g)) : (allScripts[i].src),
						trim = (fileName[0].length > 50) ? (fileName[0].substr(0,50) + '...') : (fileName[0]),
						scriptUrl = allScripts[i].src,
						loc = 'Internal',
						fullUrl = document.createElement('p');

					if(allScripts[i].src.lastIndexOf(url) === -1 || allScripts[i].src.lastIndexOf(url) > 9){
						third = third + 1;
						loc = 'External';
					}

					li.className = li.className + ' file';
					count.innerHTML = (i+1) + '. ';
					fullUrl.innerHTML = '<span>File Path:</span> <a target="_blank" href="'+scriptUrl+'">'+scriptUrl+'</a>';
					title.appendChild(count);
					title.innerHTML = title.innerHTML + ' ' + trim + '<span> : ' + loc + '</span>' + ((inserted === true) ? ('<span> & Injected @ '+insertTime+'</span>') : (''));
					div.appendChild(title);
					div.appendChild(fullUrl);
					files = files + 1;

				} else if(allScripts[i].innerHTML){
					var js = htmlEscape(allScripts[i].innerHTML),
						jsSnippet = document.createElement('p');

					li.className = li.className + ' inline';
					jsSnippet.innerHTML = '<span>Script Snippet: </span>' + js;
					inline = inline + 1;
					count.innerHTML = (i+1) + '. ';
					title.appendChild(count);
					title.innerHTML = title.innerHTML + 'Inline Script';
					div.appendChild(title);
					div.appendChild(jsSnippet);
				}

				li.appendChild(div);

				if(scriptLocation === 'HEAD'){
					headList.appendChild(li);
				} else {
					bodyList.appendChild(li);
				}
			}

			function runRemoved(){
				for(var i = 0; i < removedScripts.length; i++){
					var li = document.createElement('li'),
						div = document.createElement('div'),
						title = document.createElement('h3');

					li.className = 'script';

					if(removedScripts[i].node.src){
						var fileName = removedScripts[i].node.src.match(/[^/]+$/g),
							trim = (fileName[0].length > 30) ? (fileName[0].substr(0,30) + '...') : (fileName[0]),
							scriptUrl = removedScripts[i].node.src,
							loc = 'Internal',
							fullUrl = document.createElement('p');

						li.className = li.className + ' removed file';
						fullUrl.innerHTML = '<span>File Path:</span> <a target="_blank" href="'+scriptUrl+'">'+scriptUrl+'</a>';
						title.innerHTML = title.innerHTML + ' ' + trim + '<span> : Removed Script File</span>' + '<span> @ '+removedScripts[i].timing+'</span>';
						div.appendChild(title);
						div.appendChild(fullUrl);

					} else if(removedScripts[i].node.innerHTML){

						var js = htmlEscape(removedScripts[i].node.innerHTML),
							jsSnippet = document.createElement('p');

						li.className = li.className + ' removed inline';
						jsSnippet.innerHTML = js;
						title.innerHTML = title.innerHTML + 'Removed Inline Script' + '<span> @ '+removedScripts[i].timing+'</span>';
						div.appendChild(title);
						div.appendChild(jsSnippet);
					}

					li.appendChild(div);
					deletedList.appendChild(li);
				}
			}

			if(removedScripts.length){
				runRemoved();
			}

			counts.innerHTML = 'Script Files: <span>'+files+'</span>. Inline Scripts: <span>'+inline+'</span>. Injected: <span>'+insertedScripts.length+'</span>. Removed: <span>'+removedScripts.length+'</span>. External Files: <span>'+third+'</span>.';
			info.id = 'script-info';
			info.appendChild(total);
			info.appendChild(ref);
			info.appendChild(counts);
			listWrap.appendChild(headList);
			listWrap.appendChild(bodyList);
			listWrap.appendChild(deletedList);
			scripts.appendChild(info);
			scripts.appendChild(listWrap);
			wrapper.innerHTML = '';
			wrapper.appendChild(scripts);

			if((jStatus === 'DOM Ready' || jStatus === 'Document Loading' || jStatus === 'Window Loaded') && (lastLength !== allScripts.length || lastAdded !== insertedScripts.length || lastRemoved !== removedScripts.length)){
				var nodez = '';

				nodez = wrapper.innerHTML;

				console.log("should've sent");

				chrome.runtime.sendMessage({attempt : "new", newScripts: nodez}, function(response) {

				});
			}

			var oldScripts = allScripts.length,
				oldAdded = insertedScripts.length,
				oldRemoved = removedScripts.length;

			updateWindow(oldScripts, oldAdded, oldRemoved);

		},100);
	};

	updateStatus();

	updateWindow();

})();