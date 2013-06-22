var jStatus = 'Head',
	DOMready=function(){function c(){o=true;if(r){t.removeEventListener("DOMContentLoaded",c,false)}while(s=i.shift()){s()}}var e=window,t=e.document,n=t.createElement,r=!!t.addEventListener,i=[],s,o,u,a,f,l=function(){var e,n=3,r=t.createElement("div"),i=r.getElementsByTagName("i");while(r.innerHTML="<!--[if gt IE "+ ++n+"]><i></i><![endif]-->",i[0]);return n>4?n:e}();return function(s){if(o){return s()}if(r){t.addEventListener("DOMContentLoaded",c,false)}else if(l<9){a=e.setInterval(function(){if(t.body){try{n("div").doScroll("left");e.clearInterval(a)}catch(r){return}c();return}},10);function h(){if(t.readyState=="complete"){t.detachEvent("onreadystatechange",h);e.clearInterval(a);e.clearInterval(f);c()}}t.attachEvent("onreadystatechange",h);f=e.setInterval(function(){h()},10)}u=function(){c();if(r){t.removeEventListener("load",u,false)}else{t.detachEvent("onload",u)}};if(r){t.addEventListener("load",u,false)}else{t.attachEvent("onload",u)}i.push(s)}}();


var updateStatus = function(){
	var check = setTimeout(function(){

		if (jStatus === 'Head'){
			if(document.body){
				jStatus = 'Document Loading';
			} else if(jStatus === 'DOM Ready'){
				clearTimeout(check);
			}else{
				updateStatus();
			}
		}
	}, 10);

	DOMready(function(){
		jStatus = 'DOM Ready';
	});

	window.onload = function(){
		jStatus = 'Window Loaded';
	};
};

updateStatus();

var insertedScripts = [],
	removedScripts  = [];

function DOMNodeInsertedHandler(ev){
	if(ev.target.tagName === 'SCRIPT'){
		insertedScripts.push({node: ev.target.cloneNode(), timing: jStatus});
	}
}

function DOMNodeRemovedHandler(ev){
	if(ev.target.tagName === 'SCRIPT'){
		removedScripts.push({node: { src : ev.srcElement.src, innerHTML : ev.srcElement.innerHTML}, timing: jStatus});
	}
}

document.addEventListener('DOMNodeInserted', DOMNodeInsertedHandler, true);
document.addEventListener('DOMNodeRemoved',  DOMNodeRemovedHandler,  true);