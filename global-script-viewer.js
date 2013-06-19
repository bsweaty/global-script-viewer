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

/*jshint multistr: true */

(function(){

	var insertedScripts = [],
		removedScripts  = [],
		allScripts = document.getElementsByTagName('script'),
		status = 'Head',
		viewer = document.createDocumentFragment(),
		wrapper = document.createElement('div'),
		wrapStyle = wrapper.style,
		css = '',
		url = window.location.hostname,
		style = document.createElement('style'),
		head = document.getElementsByTagName('head')[0],
		DOMready=function(){function c(){o=true;if(r){t.removeEventListener("DOMContentLoaded",c,false)}while(s=i.shift()){s()}}var e=window,t=e.document,n=t.createElement,r=!!t.addEventListener,i=[],s,o,u,a,f,l=function(){var e,n=3,r=t.createElement("div"),i=r.getElementsByTagName("i");while(r.innerHTML="<!--[if gt IE "+ ++n+"]><i></i><![endif]-->",i[0]);return n>4?n:e}();return function(s){if(o){return s()}if(r){t.addEventListener("DOMContentLoaded",c,false)}else if(l<9){a=e.setInterval(function(){if(t.body){try{n("div").doScroll("left");e.clearInterval(a)}catch(r){return}c();return}},10);function h(){if(t.readyState=="complete"){t.detachEvent("onreadystatechange",h);e.clearInterval(a);e.clearInterval(f);c()}}t.attachEvent("onreadystatechange",h);f=e.setInterval(function(){h()},10)}u=function(){c();if(r){t.removeEventListener("load",u,false)}else{t.detachEvent("onload",u)}};if(r){t.addEventListener("load",u,false)}else{t.attachEvent("onload",u)}i.push(s)}}();

	css =
'#script-viewer {\
position: fixed;\
top: 0;\
left: 0;\
display: block;\
height: 100%;\
width:600px;\
color: #ddd;\
z-index: 99998;\
overflow: hidden;\
background: #000;\
-moz-box-shadow: 0 0 30px #888;\
-webkit-box-shadow: 0 0 30px #888;\
box-shadow: 0 0 30px #888;\
background: rgba(0,0,0,0.85)\
font-family:helvetica, sans-serif;\
}\
#script-viewer * {\
color:#ddd;\
word-wrap:break-word;\
margin:0;\
padding:0;\
font-family:helvetica, sans-serif;\
}\
#script-viewer #script-lists {\
overflow-y:scroll;\
display:block;\
height:85%;\
}\
#script-viewer ul {\
padding:0;\
margin:0 0 15px 0;\
border-bottom:1px solid #666;\
}\
#script-viewer ul li {\
margin:0;\
padding:0;\
overflow:hidden;\
display:block;\
}\
#script-viewer ul li div {\
padding:5px 5px 5px 10px;\
margin - bottom:10px;\
}\
#script-viewer ul li.file div h3{\
font-size:15px;\
color:#6f6;\
}\
#script-viewer ul li.inline div h3{\
font-size:15px;\
color:#f6c;\
}\
#script-viewer ul li.removed div h3{\
color:#f00;\
}\
#script-viewer ul li div h3 span {\
font-weight:100;\
color:#ddd;\
}\
#script-viewer ul li div p {\
font-size:10px;\
}\
#script-viewer ul li.inline div p {\
color: #ffc;\
}\
#script-viewer ul li.inline div p span {\
color:#ddd;\
}\
#script-viewer ul li div p span {\
color:#ccc;\
}\
#script-viewer ul a {\
color:#6cf;\
}\
#script-viewer ul a:hover {\
color:#6ff;\
}\
#script-viewer ul h2 {\
text-align:center;\
font-size:21px;\
padding: 10px 0;\
}\
#script-info {\
text-align:center;\
border-bottom: 1px solid #666;\
background:#000;\
height:15%;\
}\
#script-info h2 {\
font-size:30px;\
font-weight:100;\
padding: 20px 0 0 0;\
}\
#script-info h3 {\
font-size:14px;\
font-weight:100;\
}\
#script-info h3 span {\
color:#0ff;\
font-weight:800;\
}\
#script-info h2 span {\
color:#f0f;\
font-weight:800;\
}';

	css.replace(/ +?/g, '');

	wrapper.id = 'script-viewer';

	viewer.appendChild(wrapper);


	style.type = 'text/css';

	if (style.styleSheet){
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}

	function DOMNodeInsertedHandler(ev){
		if(ev.target.tagName === 'SCRIPT'){
			insertedScripts.push({node: ev.target.cloneNode(), timing: status});
		}
	}

	function DOMNodeRemovedHandler(ev){
		if(ev.target.tagName === 'SCRIPT'){
			removedScripts.push({node: { src : ev.srcElement.src, innerHTML : ev.srcElement.innerHTML}, timing: status});
		}
	}

	document.addEventListener('DOMNodeInserted', DOMNodeInsertedHandler, true);
	document.addEventListener('DOMNodeRemoved',  DOMNodeRemovedHandler,  true);

	function htmlEscape(str) {

		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	var updateStatus = function(){
		var check = setTimeout(function(){

			if (status === 'Head'){
				if(document.body){
					document.body.appendChild(viewer);
					head.appendChild(style);
					status = 'Document Loading';
				} else if(status === 'DOM Ready'){
					clearTimeout(check);
				}else{
					updateStatus();
				}
			}
		}, 10);

		DOMready(function(){
			status = 'DOM Ready';
		});

		window.onload = function(){
			status = 'Window Loaded';
		};
	};

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
				counts = document.createElement('h3'),
				inline = 0,
				files = 0,
				third = 0;

			total.innerHTML = 'Number of Scripts: <span>' + allScripts.length + '.</span>';
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
						insertTime = status;
						li.className = li.className +  ' inserted';
					}
				}

				if(allScripts[i].src){
					var fileName = allScripts[i].src.match(/[^/]+$/g),
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
			info.appendChild(counts);
			listWrap.appendChild(headList);
			listWrap.appendChild(bodyList);
			listWrap.appendChild(deletedList);
			scripts.appendChild(info);
			scripts.appendChild(listWrap);

			if((status === 'DOM Ready' || status === 'Document Loading' || status === 'Window Loaded') && (lastLength !== allScripts.length || lastAdded !== insertedScripts.length || lastRemoved !== removedScripts.length)){
				document.getElementById('script-viewer').innerHTML = '';
				document.getElementById('script-viewer').appendChild(scripts);
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

