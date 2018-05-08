////////////
// COMMON //
////////////

function showHidePopupMenu() {
	var itemId = arguments[0];
	var itemsArray = arguments;
	hideOtherItems(arguments);
	if (document.getElementById(itemId)) {
		if (document.getElementById(itemId).style.display != 'inline') {
			// show
			document.getElementById('dimoverlay').style.visibility = 'visible';
			document.getElementById(itemId).style.display = 'inline';
			document.getElementById('dimoverlay').onclick = function(){ showHidePopupMenu.apply(this, itemsArray) };
		}else {
			// hide
			document.getElementById(itemId).style.display = 'none';
			document.getElementById('dimoverlay').style.visibility = 'hidden';
			document.getElementById('dimoverlay').onclick = null;
		}
	}
}

// WARNING: hides only items after the first one
function hideOtherItems(itemsArray){
	for (var i = 1; i < itemsArray.length; i++) {
		if (document.getElementById(itemsArray[i])) {
			document.getElementById(itemsArray[i]).style.display = 'none';
		}
	}
}

function beforeSubmitCheckbox(){
	for (var i = 0; i < arguments.length; i++) {
		var hiddenId = arguments[i] + "Hidden";
		if(document.getElementById(arguments[i]).checked){
			  document.getElementById(hiddenId).disabled = true;
		}
	}
}

function displayBrowserInfo(infoDivId) {
    var info =
	"<table>" +
	"<tr><td>window.innerWidth: </td><td>" + window.innerWidth + "</td></tr>" +
	"<tr><td>window.innerHeight: </td><td>" + window.innerHeight + "</td></tr>" +
	"<tr><td>window.outerWidth: </td><td>" + window.outerWidth + "</td></tr>" +
	"<tr><td>window.outerHeight: </td><td>" + window.outerHeight + "</td></tr>" +
	"<tr><td>window.devicePixelRatio: </td><td>" + window.devicePixelRatio + "</td></tr>" +
	"<tr><td>navigator.userAgent: </td><td>" + navigator.userAgent + "</td></tr>" +
	"<tr><td>navigator.platform: </td><td>" + navigator.platform + "</td></tr>" +
	"<tr><td>navigator.language: </td><td>" + navigator.language + "</td></tr>" +
	"<tr><td>screen.availWidth: </td><td>" + screen.availWidth + "</td></tr>" +
	"<tr><td>screen.availHeight: </td><td>" + screen.availHeight + "</td></tr>" +
	"<tr><td>screen.width: </td><td>" + screen.width + "</td></tr>" +
	"<tr><td>screen.height: </td><td>" + screen.height + "</td></tr>" +
	"</table>";
    document.getElementById(infoDivId).innerHTML = info;
}

//////////////////
// BOOK DETAILS //
//////////////////

function loadBookDetails(itemId, rootPath){
	var xmlhttp, originUrl;
    // store current url to know where to come back after closing a book
    originUrl = window.location.href;
    sessionStorage.originUrl = originUrl.replace("?settings=true", ""); // remove param which is useless when closing a book
    // tell epub reader to load bookmark
    sessionStorage.loadBookmark = true;
	document.getElementById('bookdetails').innerHTML="<div id=\"progressbar\"></div>";
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
	    	document.getElementById('bookdetails').innerHTML=xmlhttp.responseText;
	    }
	}
	xmlhttp.open("GET", rootPath + "bookdetails/" + itemId ,true);
	xmlhttp.send();
}

///////////////////
// COMIC DETAILS //
///////////////////

function loadComicDetails(itemId, rootPath){
	var xmlhttp;

	document.getElementById('comicdetails').innerHTML="<div id=\"progressbar\"></div>";
	xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
	    	document.getElementById('comicdetails').innerHTML=xmlhttp.responseText;
	    }
	}
	xmlhttp.open("GET", rootPath + "comicdetails/" + itemId ,true);
	xmlhttp.send();
}
