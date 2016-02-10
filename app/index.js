var url = "https://raw.githubusercontent.com/maxandersen/yellowhat/master/doc/sample-issues.json";

function create_new_issue(obj) {
	var issue = $("<tr>");

	var cols = [obj.project, obj.native_id, obj.summary, obj.status, obj.source, obj.native_status, format_components(obj.components)];

	var i;
	for (i = 0; i < cols.length; i++) {
		var td = $("<td>");
		if (i == 1) {
			var link = $("<a>");
			link.html(cols[i]);
			link.attr("href", obj.weburl);
			td.append(link);
		} else {
			td.html(cols[i]);	
		}
		issue.append(td);
	}

	return issue;
}
function isNum(val) {
	var isnum = /^\d+$/.test(val);
	return isnum;
}

function create_issue_table(obj) {
	var table = $("<table>");
	table.addClass("table").addClass("table-hover");
	var tbody = $("<tbody>");
	tbody.append(create_table_header());
	table.append(tbody);
	return table;
}


function create_table_header() {
	// var theader = $("<thead>");
	var tr = $("<tr>");

	var cols = ["Project", "Id", "Summary", "Status", "Source", "Native Status", "Components"];

	var i;
	for (i = 0; i < cols.length; i++) {
		var th = $("<th>");
		// th.addClass("col-md-3");
		var b = $("<b>");

		b.html(cols[i]);
		th.append(b);
		tr.append(th);
	}

	// theader.append(tr);
	return tr;
}

function format_components(components) {

	if (components == undefined) {
		return "";
	}

	var i;
	var listString = "";
	for (i = 0; i < components.length; i++) {
		listString = listString + ", " + components[i].name;
	}
	listString = listString.substring(1);
	return listString;
}

function create_row(first, second, isLink) {
	var row = $("<tr>");
	var firstCell = $("<td>");
	var secondCell = $("<td>");
	var boldThing = $("<b>");
	boldThing.html(first);
	firstCell.append(boldThing);
	if (isLink) {
		var link = $("<a>");
		link.html(second);
		link.attr("href", second)
		secondCell.append(link);
	} else {
    	secondCell.html(second);
	}
	
	row.append(firstCell).append(secondCell);
	return row;
}

function get_demo_JSON() {
	var json;

    $.ajax({
        url: url,
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


function compareByProject(a, b) {
	return a.project < b.project;
}

function compareById(a, b) {
	return a.id < b.id;
}

function getProjectIssues(project, objects) {

	var i;
	var l = [];
	for (i = 0; i < objects.length; i++) {
		if (objects[i].project == project) {
			l.push(objects[i])
		}
	}

	return l;
}

function getSourceIssues(source, objects) {

	var i;
	var l = [];
	for (i = 0; i < objects.length; i++) {
		if (objects[i].source == source) {
			l.push(objects[i])
		}
	}

	return l;
}


function getProjectPanel(projectName, objects) {
	var issues = getProjectIssues(projectName, objects);

	var panelHeading;
	var panelBody;
	var project = $("<div>");
	panelHeading = $("<div>");
	panelBody = $("<div>");

	project.addClass("panel");
	project.addClass("panel-primary");

	panelHeading.addClass("panel-heading");
	panelBody.addClass("panel-body");
	var showIssues = $("<button>");
	showIssues.attr("type", "button");
	showIssues.addClass("btn").addClass("btn-default");
	showIssues.html("Show Issues");
	showIssues.click(function() {
		console.log(projectName.replace(/\s/g, '').replace(/\//g, ''));
		$('#' + projectName.replace(/\s/g, '').replace(/\//g, '') + "-table").slideToggle('fast');
	});

	var table = create_issue_table();
	table.hide();
	table.attr("id", projectName.replace(/\s/g, '').replace(/\//g, '') + "-table");
	for (i = 0; i < issues.length; i++) {
		var issue = issues[i];
		table.append(create_new_issue(issue));
	}

	var statsPanel = getStatsPanel(projectName, objects);

	panelHeading.html(projectName);
	panelBody.append(statsPanel);
	panelBody.append(showIssues);
	panelBody.append(table);

	project.append(panelHeading);
	project.append(panelBody);

	return project;
}


function getSourcePanel(projectName, objects) {
	var issues = getSourceIssues(projectName, objects);

	var panelHeading;
	var panelBody;
	var project = $("<div>");
	panelHeading = $("<div>");
	panelBody = $("<div>");

	project.addClass("panel");
	project.addClass("panel-primary");

	panelHeading.addClass("panel-heading");
	panelBody.addClass("panel-body");
	var showIssues = $("<button>");
	showIssues.attr("type", "button");
	showIssues.addClass("btn").addClass("btn-default");
	showIssues.html("Show Issues");
	showIssues.click(function() {
		console.log(projectName.replace(/\s/g, '').replace(/\//g, ''));
		$('#' + projectName.replace(/\s/g, '').replace(/\//g, '') + "-table").slideToggle('fast');
	});

	var table = create_issue_table();
	table.hide();
	table.attr("id", projectName.replace(/\s/g, '').replace(/\//g, '') + "-table");
	for (i = 0; i < issues.length; i++) {
		var issue = issues[i];
		table.append(create_new_issue(issue));
	}

	var statsPanel = getSourceStatsPanel(projectName, objects);

	panelHeading.html(projectName);
	panelBody.append(statsPanel);
	panelBody.append(showIssues);
	panelBody.append(table);

	project.append(panelHeading);
	project.append(panelBody);

	return project;
}

function getClosedIssueCount(objects) {
	var count = 0;

	var i = 0;
	for (i = 0; i < objects.length; i++) {
		if (objects[i].status == "closed") {
			count++
		}
	}

	return count;
}

function getPercentage(closed, total) {
	return closed / total * 100
}

function getStatsPanel(projectName, objects) {
	var issues = getProjectIssues(projectName, objects);

	var panelHeading;
	var panelBody;
	var stats = $("<div>");
	panelHeading = $("<div>");
	panelBody = $("<div>");

	stats.addClass("panel");
	stats.addClass("panel-default");

	panelHeading.addClass("panel-heading");
	panelBody.addClass("panel-body");
	var closedBar = $("<div>");
	closedBar.addClass("progress");
	var progressBar = $("<div>");
	var closedCount = getClosedIssueCount(issues);

	progressBar.addClass("progress-bar");
	if (closedCount == issues.length) {
		progressBar.addClass("progress-bar-success");
	} else {
		progressBar.addClass("progress-bar-warning");
	}
	progressBar.html(closedCount + " / " + issues.length);
	progressBar.attr("role", "progressbar");
	progressBar.attr("aria-valuenow", closedCount);
	progressBar.attr("aria-valuemin", "0");
	progressBar.attr("aria-valuemax", issues.length);
	progressBar.attr("style", "min-width: 1em; width:" + closedCount / issues.length * 100 + "%;");

	closedBar.append(progressBar);
	panelBody.append(closedBar);

	panelHeading.html("Statistics");
	stats.append(panelHeading);
	stats.append(panelBody);

	return stats;
}


function getSourceStatsPanel(projectName, objects) {
	var issues = getSourceIssues(projectName, objects);

	var panelHeading;
	var panelBody;
	var stats = $("<div>");
	panelHeading = $("<div>");
	panelBody = $("<div>");

	stats.addClass("panel");
	stats.addClass("panel-default");

	panelHeading.addClass("panel-heading");
	panelBody.addClass("panel-body");
	var closedBar = $("<div>");
	closedBar.addClass("progress");
	var progressBar = $("<div>");
	var closedCount = getClosedIssueCount(issues);

	progressBar.addClass("progress-bar");
	if (closedCount == issues.length) {
		progressBar.addClass("progress-bar-success");
	} else {
		progressBar.addClass("progress-bar-warning");
	}
	progressBar.html(closedCount + " / " + issues.length);
	progressBar.attr("role", "progressbar");
	progressBar.attr("aria-valuenow", closedCount);
	progressBar.attr("aria-valuemin", "0");
	progressBar.attr("aria-valuemax", issues.length);
	progressBar.attr("style", "min-width: 2em; width:" + closedCount / issues.length * 100 + "%;");

	closedBar.append(progressBar);
	panelBody.append(closedBar);

	panelHeading.html("Statistics");
	stats.append(panelHeading);
	stats.append(panelBody);

	return stats;
}


function inArray(item, array) {
    'use strict';

    return $.inArray(item, array) > -1;
}

function getProjects(objects) {
	var projects = [];

	var i;
	for (i = 0; i < objects.length; i++) {
		if (!inArray(objects[i].project, projects)) {
			projects.push(objects[i].project);
		}
	}

	return projects;
}

function getSources(objects) {
	var projects = [];

	var i;
	for (i = 0; i < objects.length; i++) {
		if (!inArray(objects[i].source, projects)) {
			projects.push(objects[i].source);
		}
	}

	return projects;
}

function groupIssuesByProject() {
	var issues = get_demo_JSON();

	var projects = getProjects(issues);

	var i;
	var issueList = $("#main-list-panel-body");

	for (i = 0; i < projects.length; i++) {
		var projectPanel = getProjectPanel(projects[i], issues);
		issueList.append(projectPanel);
	}

}

function groupIssuesBySource() {
	var issues = get_demo_JSON();

	var projects = getSources(issues);

	var i;
	var issueList = $("#main-list-panel-body");

	for (i = 0; i < projects.length; i++) {
		var projectPanel = getSourcePanel(projects[i], issues);
		issueList.append(projectPanel);
	}

}

function groupIssuesBy(key) {
	var issueList = $("#main-list-panel-body");
	issueList.empty();

	switch (key) {
		case "Project":
		    groupIssuesByProject();
		    break;
		case "Issue":
			groupIssuesByIssue();
			break;
		case "Source":
		    groupIssuesBySource();
		    break;
	}
}

function groupIssuesByIssue() {
	var issues = get_demo_JSON();
	var issueList = $("#main-list-panel-body");
	var table = create_issue_table();
	issues.sort(compareNativeId);
	for (i = 0; i < issues.length; i++) {
		var issue = issues[i];
		table.append(create_new_issue(issue));
	}
	issueList.append(table);
}

function compareNativeId(a, b) {
	if (parseInt(a.native_id) < parseInt(b.native_id)) {
		return -1
	} else if (parseInt(a.native_id) > parseInt(b.native_id)) {
		return 1;
	}
	return 0;
}

$(document).ready(function() {
	var i;
	var groupBy = $("#group-by");
	groupBy.change(function() {
		groupIssuesBy(groupBy.val());
	});

	groupIssuesByIssue();
});