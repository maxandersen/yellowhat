function create_new_issue(obj) {
	var issue;
	var panelHeading;
	var panelBody;
	issue = $("<div>");
	panelHeading = $("<div>");
	panelBody = $("<div>");

	issue.addClass("panel");
	issue.addClass("panel-primary");

	panelHeading.addClass("panel-heading");
	panelBody.addClass("panel-body");

	panelHeading.html(obj.project);
	panelBody.html("JSDT Project Content");

	issue.append(panelHeading);
	issue.append(panelBody);

	return issue;

	// $("#issue-list").append(issue);
}

function get_demo_JSON() {
	var json;

    $.ajax({
        url: 'https://raw.githubusercontent.com/maxandersen/yellowhat/6a8a8e85ee831c19e7b9dc78c47582894858ed1d/doc/sample-issues.json',
        dataType: 'json',
        async: false,
        success: function (data) {
            json = data;
        },
        error: function () {
            throw 'No json found';
        }
    });

    return json;
}

$(document).ready(function() {
	var i;

	var issues = get_demo_JSON();
	var issueList = $("#main-list-panel-body");

	for (i = 0; i < issues.length; i++) {
		var issue = issues[i];
		console.log(issue);
		var issue = create_new_issue(issue);
		issueList.append(issue);
	}

	for (i = 0; i < 10; i++) {
		var issue = create_new_issue();
		issueList.append(issue);
	}

	console.log(get_demo_JSON());
});