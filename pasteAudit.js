var clone

var options = {
	env: {
		uat: 'http://uat.op.local',
		ci: 'http://ci.op.local',
		prod: 'https://app.observepoint.com'
	},
	allowEmail: false,
	allowStartNow: false,
	forceStartNow: false,
	max100Pages: false
}

function getAuditRequestBody(clone) {
	var pathArray = window.location.pathname.split('/')
	var newFolder = pathArray[3]
	var domainId = pathArray[5]

	var notificationEmails = function () {

		var emails = clone[0].Notifications

		if (options.allowEmail) {
			if (emails == "test@example.com") {
				return []
			} else {
				return emails.split(/\r\n|\n|\r/)
			}
		} else {
			return []
		}

	}

	var location = function () {
		var nl = "mountain"
		var ol = clone[0].Location
		// will eventually need support for custom proxy

		// if oldLocation is 1: "mountain"
		// if oldLocation is 2: "western"
		// if oldLocation is 4: "eastern"
		// if oldLocation is 5: "emea"
		// if oldLocation is 8: "apac"
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
	// TODO:
	// var getUserAgents = function () {
	// 	var data = null;
	// 	var key = JSON.parse(window.localStorage["op.authorization"]).token
	// 	var xhr = new XMLHttpRequest();
	// 	xhr.withCredentials = true;
	//
	// 	xhr.addEventListener("readystatechange", function () {
	// 	  if (this.readyState === 4) {
	// 			response = JSON.parse(this.responseText)
	//
	// 	  }
	// 	});
	//
	// 	xhr.open("GET", "https://app.observepoint.com/api/user-agents", false);
	// 	xhr.setRequestHeader("authorization", "Bearer " + key)
	// 	xhr.setRequestHeader("cache-control", "no-cache");
	//
	// 	xhr.send(data);
	// 	return response.data
	// }

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
			// if (action == "10") {
			// 	return "watch"
			// }

		}

		var oldActions = clone[0].ActionSet

		var naSet = new Array

		for (i=0; i < oldActions.length; i++) {
				var na = jQuery.extend({}, naSet)
				var matchAllPages = oldActions[i].RegexFilter === ".*"
				var navto 	= oldActions[i].ActionType == 1,
						click 	= oldActions[i].ActionType == 4,
						input 	= oldActions[i].ActionType == 5,
						select 	= oldActions[i].ActionType == 6,
						check 	= oldActions[i].ActionType == 7,
						uncheck = oldActions[i].ActionType == 8,
						execute = oldActions[i].ActionType == 9;

				if (execute) {
					na = {
						"matchAllPages": matchAllPages,
						"preventNavigation": oldActions[i].PreventNav,
						"label": "",
						"filter": oldActions[i].RegexFilter,
						"sequence": i,
						"js": oldActions[i].Value,
						"rules": [],
						"action": convertActionType(oldActions[i].ActionType),
						"type": convertActionType(oldActions[i].ActionType),
						"value": ""
						}
			} else if (navto) {
					na = {
						"matchAllPages": matchAllPages,
						"preventNavigation": oldActions[i].PreventNav,
						"url": oldActions[i].Value,
						"label": "",
						"filter": oldActions[i].RegexFilter,
						"sequence": i,
						"rules": [],
						"action": convertActionType(oldActions[i].ActionType),
						"type": convertActionType(oldActions[i].ActionType),
						"value": ""
						}
			} else if (click || check || uncheck) {
					na = {
						"matchAllPages": matchAllPages,
						"identifier": oldActions[i].Identifier,
						"preventNavigation": oldActions[i].PreventNav,
						"label": "",
						"filter": oldActions[i].RegexFilter,
						"sequence": i,
						"rules": [],
						"action": convertActionType(oldActions[i].ActionType),
						"type": convertActionType(oldActions[i].ActionType),
						"value": ""
						}
			} else if (input || select) {
					na = {
						"matchAllPages": matchAllPages,
						"identifier": oldActions[i].Identifier,
						"preventNavigation": oldActions[i].PreventNav,
						"label": "",
						"filter": oldActions[i].RegexFilter,
						"sequence": i,
						"rules": [],
						"value": oldActions[i].Value,
						"action": convertActionType(oldActions[i].ActionType),
						"type": convertActionType(oldActions[i].ActionType)
						}
			}
			naSet.push(na)
		}
		return naSet
	}
	// for a migration from legacy "rules" will be empty
	// because step rules don't exist in legacy
	// global rules need to be migrated from legacy "Monitor" values
	var createGlobalRules = function () {
		// create rules from the Monitor feature (assuming their copied)
		// POST /rule-sets which requires
		// tagId, and variables, an array of {variable, matchType, value}

		// return array of ids of the rules
	}

	var setGlobalRules = function (simId, ruleIds) {
		// POST /web-sims/simId/rules
		// the payload is rules which is an array of ruleIds
	}

	var name = function () {
		var oldName = 			clone[0].Name
		var silentMode = 		clone[0].SilentMode
		var userAgent = 		clone[0].UserAgentText
		var customProxy = 	clone[0].Location === 'Custom Proxy'

		if (silentMode && !customProxy) {
				return oldName + " - " + userAgent + " (Silent Mode)"
		} else if (silentMode && customProxy) {
				return oldName + " - " + userAgent + " (Silent Mode, Custom Proxy)"
		} else if (!silentMode && customProxy) {
				return oldName + " - " + userAgent + " (Custom Proxy)"
		} else {
				return oldName + " - " + userAgent
		}
	}

	var nextRun = function () {
		var date = 		clone[0].NextStartDate,
				dateArr = date.split('/'),
				mo = 			dateArr[0],
				day = 		dateArr[1],
				yr = 			dateArr[2],
				scheduleOption = 	clone[0].Schedule,
				isScheduled = 		scheduleOption == 0,
				isStartNow = 			scheduleOption == 1,
				isNotScheduled = 	scheduleOption == 2,
				scheduledDate = new Date(date),
				now = 					new Date,
				isInPast = 		now > scheduledDate,
				isInFuture = 	scheduledDate >= now;

		var nu = {
					yr: 	now.getUTCFullYear(),
					mo: 	now.getUTCMonth(),
					day: 	now.getUTCDate(),
					hrs: 	now.getUTCHours(),
					min:  now.getUTCMinutes(),
					sec:  now.getUTCSeconds(),
					mil: 	now.getUTCMilliseconds()
				}

		var currentUtcTime = nu.yr+'-'+nu.mo+'-'+nu.day+'T'+nu.hrs+':'+nu.min+':'+nu.sec+'.'+nu.mil+'Z'



		if (options.forceStartNow) {

			return currentUtcTime
		}

		if (isStartNow && options.allowStartNow) {

			return currentUtcTime

		}
		if (isScheduled && isInPast) {

			if (options.allowStartNow) {

				return yr+'-'+mo+'-'+day+'T'+nu.hrs+':'+nu.min+':'+nu.sec+'.'+nu.mil+'Z'

			} else {

				return null

			}
		}

		if (isScheduled && isInFuture) {

			return yr+'-'+mo+'-'+day+'T'+nu.hrs+':'+nu.min+':'+nu.sec+'.'+nu.mil+'Z'

		}

		if (isNotScheduled) {

			return null

		}



	}

	var reduceServerLoad = function () {
		var rsl = clone[0].ReduceServerLoad
		if (rsl) {
			return 1
		} else {
			return 10
		}
	}


// replaced notificationEmails() with empty array for safety :)
	var auditActionsReqBody = JSON.stringify(actions())
	var auditRequestBody = JSON.stringify({
		"domainId": parseInt(domainId),
		"name":name(),
		"limit": parseInt(clone[0].PageLimit),
		"startingUrls": clone[0].StartingPages.split(/\r\n|\n|\r/),
		"frequency": clone[0].ScheduleFrequencyText.toLowerCase(),
		"recipients": notificationEmails(),
		"nextRun": nextRun(),
		"filters": {
			"include": clone[0].IncludeList.split(/\r\n|\n|\r/),
			"exclude": clone[0].ExcludeList.split(/\r\n|\n|\r/)
		},
		"ruleSets": null,
		"options": {
				"location": location(),
				"userAgent": "Firefox(45.0.1) - Linux",
				//"userAgent":userAgent(clone[0].UserAgentText),
				"requestRate": reduceServerLoad(),
				"fireTags": false,
				"clearCookies": clone[0].ClearCookies,
				"stripQueryString": clone[0].TemplateMode,
				"loadFlash": clone[0].LoadVideos,
				"browserWidth": browserWidth()
				//"alerts":clone[0].SendAlerts,
				//"reminders":clone[0].SendReminders,

			}
			//,"actions": actions()
	})

	return [auditRequestBody, auditActionsReqBody]
}

// TODO pull this from localStorage
// function getAccountId () {
//
// 	return parseInt(document.getElementById("loggedInAsAnotherBar").innerText.split('d:')[2])
// }

function postAudit(auditRequestBody, key) {
	var env = options.env.prod
	var api = "/api"
	var resource = "/audits"
	var endpoint = env + api + resource
	var response;
	var data = auditRequestBody[0];
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
		putAuditActions(response.data.id, auditRequestBody[1], key)
	}
}

function putAuditActions (id,auditRequestBody, key) {
	var env = options.env.prod
	var api = "/api"
	var resource = "/audits/"+id+"/actions"
	var endpoint = env + api + resource
	var response;
	var data = auditRequestBody;
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.addEventListener("readystatechange", function () {
		if (this.readyState === 4) {
			response = JSON.parse(this.responseText)
		}
	});

	xhr.open("PUT", endpoint, false);
	xhr.setRequestHeader("authorization", "Bearer " + key);
	xhr.setRequestHeader("content-type", "application/json");
	xhr.setRequestHeader("cache-control", "no-cache");

	xhr.send(data);

	if (!response) {
		console.log("Error: No response from API")
	} else {
		console.log(response)
		return response.data
	}
}

function pasteAudit() {

	chrome.storage.sync.get("observePointAuditClone", function (obj) {

    clone = JSON.parse(obj["observePointAuditClone"]);
		customerKey = JSON.parse(window.localStorage["op.authorization"]).token
		rb = getAuditRequestBody(clone)
		newAudit = postAudit(rb, customerKey)
		location.reload()
		console.log("auditRequestBody: " + rb[0])
		console.log("auditActionsReqBody: " + rb[1])
		console.log("Success!")
	});
}
