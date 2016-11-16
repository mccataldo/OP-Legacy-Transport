var clone;

function getRequestBody(clone) {
	var pathArray = window.location.pathname.split('/')
	var newFolder = pathArray[3]
	var domainId = pathArray[5]

	var notificationEmails = function () {

		var emails = clone[0].NotificationEmails

		if (options.allowEmail) {
			if (emails == "test@example.com") {
				return []
			} else {
				return emails.split(/\r\n|\n|\r/)
			}
		} else {
			return []
		}

		return emailArr
	}

	var location = function () {
		var nl = "mountain"
		var ol = clone[0].Location

		if (ol == 1) {
			nl = "mountain"
		}
		if (ol == 2) {
			nl = "western"
		}
		if (ol == 4) {
			nl = "eastern"
		}
		if (ol == 5) {
			nl = "emea"
		}
		if (ol == 8) {
			nl = "apac"
		}

		return nl

	}

	var userAgent = function (oldUserAgentText) {

		return "Firefox(45.0.1) - Linux"
	}

	var browserWidth = function() {

		var oldWidth = clone[0].BrowserOverride
		var defaultWidth = 1366
		if (oldWidth == "") {
			return defaultWidth
		} else {
			return parseInt(oldWidth)
		}

	}

	var actions = function () {

		var convertActionType = function (action) {
			if (action == "1") {
				return "navto"
			}
			if (action == "4") {
				return "click"
			}
			if (action == "5") {
				return "input"
			}
			if (action == "6") {
				return "select"
			}
			if (action == "7") {
				return "check"
			}
			if (action == "8") {
				return "uncheck"
			}
			if (action == "9") {
				return "execute"
			}
			if (action == "10") {
				return "watch"
			}

		}

		var firstAction = {
			"ActionType": "1",
			"Identifier":"",
			"PreventNav":false,
			"Value":""
		}
		var oldActions = [firstAction].concat(clone[0].ActionSet)
		var naSet = new Array
		var na = jQuery.extend({}, naSet)
		for (i=0; i < oldActions.length; i++) {
				if (oldActions[i].ActionType == 9) {
					na = {
						"action": convertActionType(oldActions[i].ActionType),
						"sequence": i,
						"rules": [],
						"url": clone[0].Address,
						"preventNavigation": oldActions[i].PreventNav,
						"js": oldActions[i].Value
						}
			} else if (oldActions[i].ActionType == 1 && i > 0) {
					na = {
						"action": convertActionType(oldActions[i].ActionType),
						"sequence": i,
						"rules": [],
						"url": oldActions[i].Value,
						"preventNavigation": oldActions[i].PreventNav
						}
			} else {
					na = {
						"action": convertActionType(oldActions[i].ActionType),
						"sequence": i,
						"rules": [],
						"url": clone[0].Address,
						"identifier": oldActions[i].Identifier,
						"preventNavigation": oldActions[i].PreventNav,
						"value": oldActions[i].Value
						}
			}
			naSet.push(na)
		}
		return naSet
	}

	var name = function () {
		var oldName = clone[0].Name
		var silentMode = clone[0].SilentMode
		var userAgent = clone[0].UserAgentText
		if (silentMode) {
			return oldName + " - " + userAgent + " (Silent Mode)"
		} else {
			return oldName + " - " + userAgent
		}
	}
	// replaced notificationEmails() with empty array for safety :)
	var requestBody = JSON.stringify({
		"name":name(),
		"domainId": parseInt(domainId),
		"emails":[],
		"options":
			{
				"frequency":clone[0].FrequencyText.toLowerCase(),
				"location":location(),
				"userAgent":userAgent(clone[0].UserAgentText),
				"browserWidth":browserWidth(),
				"alerts":clone[0].SendAlerts,
				"reminders":clone[0].SendReminders,
				"loadFlash":clone[0].LoadVideos
			},
		"actions":actions()
	})

	return requestBody
}

function postJourney(requestBody, key) {
	var env = options.env
	var api = "/api"
	var resource = "/web-sims"
	var endpoint = env + api + resource
	var response;
	var data = requestBody;
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
	  if (this.readyState === 4) {
			response = JSON.parse(this.responseText)
	  }
	});

	xhr.open("POST", endpoint, false);
	xhr.setRequestHeader("authorization", "Bearer " + key);
	xhr.setRequestHeader("content-type", "application/json");
	xhr.setRequestHeader("cache-control", "no-cache");

	xhr.send(data);

	if (!response) {
		console.log("Error: No response from API")
	} else {
		console.log(response)
		return response.data.id
	}
}

function pasteJourney() {

	chrome.storage.sync.get("observePointJourneyClone", function (obj) {

    clone = JSON.parse(obj["observePointJourneyClone"]);
		customerKey = JSON.parse(window.localStorage["op.authorization"]).token
		rb = getRequestBody(clone)
		newJourneyId = postJourney(rb, customerKey)
		console.log("requestBody: " + JSON.parse(rb))
		console.log("Success! Web Journey ID: " + newJourneyId)
		location.reload()
	});
}
