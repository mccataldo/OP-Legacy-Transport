function copyAudit() {
	if (window.location.href.match(/https:\/\/my.observepoint.com\/audit\/form\/.*?p=.*/) !== null) {
		chrome.storage.sync.set(
			{
				"observePointAuditClone": doAuditCopy()
			}
		)
		chrome.storage.sync.get("observePointAuditClone", function(obj){
			var output = JSON.parse(obj["observePointAuditClone"])[0]
			console.log(output)
			console.log(JSON.stringify(output))
		}
		)

	}
}

function doAuditCopy() {
	var act = new Array,
	    actList = new Array,
	    mySettings = new Array,
			action = jQuery(".action_row"),
			compliance = jQuery("#rule_sets")
			ruleList = new Array

	for (i = 0; i < action.length; i++) {
	    var clonedobj = jQuery.extend({}, act)
	    clonedobj.ActionType = jQuery(action[i]).find("select").find(":selected").val()
	    clonedobj.PreventNav = jQuery(action[i]).find('input[type="checkbox"]')[0].checked
	    clonedobj.Value = jQuery(action[i]).find("input[placeholder='value']").val()
	    clonedobj.Identifier = jQuery(action[i]).find("input[placeholder='identifier']").val()
			clonedobj.RegexFilter = jQuery(action[i]).find("input[placeholder='regex filter']").val()
	    actList.push(clonedobj)
	}

	for (j = 0; j<compliance[0].length; j++) {
		if (compliance[0][j].selected) {
			text = compliance[0][j].text
			ruleList.push(text)
		}
	}

	var clonedobj = jQuery.extend({}, act)

	clonedobj.Name = jQuery("#domain_description").val()
	clonedobj.StartingPages = jQuery("#domain_starting_urls").val()
	clonedobj.PageLimit = jQuery("#domain_max_url").val()
	clonedobj.Location = jQuery("#domain_location_id").val()
	clonedobj.LocationText = jQuery("#domain_location_id")[0].value
	clonedobj.LocationProxyUrl = jQuery("#domain_proxy")[0].value
	clonedobj.UserAgent = jQuery("#domain_user_agent_id").val()
	clonedobj.UserAgentText = jQuery("#domain_user_agent_id [selected='selected']").text()
	clonedobj.Schedule = jQuery("#auditnow").val()
	clonedobj.ScheduleText = jQuery("#auditnow")[0].selectedOptions[0].innerText
	clonedobj.ScheduleFrequency = jQuery("#scan_frequency").val()
	clonedobj.ScheduleFrequencyText = jQuery("#scan_frequency [selected='selected']").text()
	clonedobj.NextStartDate = jQuery("#next_scan_at").val()
	clonedobj.Notifications = jQuery("#domain_recipients").val()
	clonedobj.ActionSet = actList
	clonedobj.ClearCookies = jQuery("#domain_clear_cookies").prop("checked")
	clonedobj.SilentMode = jQuery("#domain_silent_mode").prop("checked")
	clonedobj.TemplateMode = jQuery("#domain_template_mode").prop("checked")
	clonedobj.ReduceServerLoad = jQuery("#reduce_server_load").prop("checked")
	clonedobj.LoadVideos = jQuery("#domain_load_videos").prop("checked")
	clonedobj.BrowserOverride = jQuery("#domain_browser_width").val()
	clonedobj.IncludeList = jQuery("#inclusions").val()
	clonedobj.ExcludeList = jQuery("#exclusions").val()
	clonedobj.UserSession = jQuery('input[name="login_action"]')[0].checked
	clonedobj.Compliance = jQuery("#rule_sets").val()
	clonedobj.ComplianceText = ruleList

	mySettings.push(clonedobj)

	return JSON.stringify(mySettings)
}
