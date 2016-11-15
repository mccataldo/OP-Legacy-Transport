var tabStorage = []
var code
chrome.browserAction.onClicked.addListener(function(tab) {

	if (tab.url.match(/.*\/audit\/form\/\d*\?p=\d*/)) {
		code = 'copyAudit()'
	}

	if (tab.url.match(/.*\/simulation\/form\/\d*\?p=\d*\&t=\d*/)) {
		code = 'copyJourney()'
	}

	if (tab.url.match(/.*\/manage\/folder\/\d*\/domain\/\d*\/journeys/)){
		code = 'pasteJourney()'
	}

	if (tab.url.match(/.*\/manage\/folder\/\d*\/domain\/\d*\/audits/)) {
		code = 'pasteAudit()';
	}

	chrome.tabs.executeScript(
		{
			code: code
  	}
	);
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

    if(request.cmd == "save") {
      tabStorage[sender.tab.id] = request.data;
    }

    if(request.cmd == "load") {
      sendResponse(tabStorage[sender.tab.id]);
    }
});
