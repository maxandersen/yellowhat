/**
 * Creates a TR
 */
function create_new_issue(obj) {
	var issue = $("<tr>");

	var cols = [obj.project, obj.id, format_components(obj.components), obj.summary];

	var i;
	for (i = 0; i < cols.length; i++) {
		var td = $("<td>");
		if (isNum(cols[i])) {
			var link = $("<a>");
			link.html(cols[i]);
			link.attr("href", obj.weburl);
			td.append(link);
		} else {
			td.html(cols[i]);	
		}
		issue.append(td);
	}


	// var panelHeading;
	// var panelBody;
	// issue = $("<div>");
	// panelHeading = $("<div>");
	// panelBody = $("<div>");

	// issue.addClass("panel");
	// issue.addClass("panel-primary");

	// panelHeading.addClass("panel-heading");
	// panelBody.addClass("panel-body");

	// var table = create_issue_table(obj);

	// panelHeading.html(obj.summary);
	// panelBody.append(table);

	// issue.append(panelHeading);
	// issue.append(panelBody);

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



	// var project = create_row("Project", obj.project, false);
	// var components = create_row("Components", format_components(obj.components), false);
	// var summary = create_row("Summary", obj.summary, false);
	// var bId = create_row("ID", obj.id);
	// var weburl = create_row("Web URL", obj.weburl, true);
	// tbody.append(project).append(summary).append(components).append(weburl);
	// table.append(tbody);
	// table.addClass("table");
	// table.addClass("table-hover");
	
	return table;
}


function create_table_header() {
	// var theader = $("<thead>");
	var tr = $("<tr>");

	var cols = ["Project", "Id", "Components", "Summary"]

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
		$('#' + projectName.replace(/\s/g, '') + "-table").slideToggle('fast');
		console.log(projectName);
	});

	var table = create_issue_table();
	table.hide();
	table.attr("id", projectName.replace(/\s/g, '') + "-table");
	for (i = 0; i < issues.length; i++) {
		var issue = issues[i];
		table.append(create_new_issue(issue));
	}

	panelHeading.html(projectName);
	panelBody.append(showIssues);
	panelBody.append(table);

	project.append(panelHeading);
	project.append(panelBody);

	return project;
}


function getStatsPanel() {
	var issues = getProjectIssues(projectName, objects);

	var panelHeading;
	var panelBody;
	var project = $("<div>");
	panelHeading = $("<div>");
	panelBody = $("<div>");

	project.addClass("panel");
	project.addClass("panel-default");

	panelHeading.addClass("panel-heading");
	panelBody.addClass("panel-body");

	panelHeading.html("Statistics");
	panelBody.append(table);

	project.append(panelHeading);
	project.append(panelBody);
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

function groupIssuesBy(key) {
	var issueList = $("#main-list-panel-body");
	issueList.empty();

	switch (key) {
		case "Project":
		    groupIssuesByProject();
		    break;
	}
}

$(document).ready(function() {
	var i;
	var groupBy = $("#group-by");
	groupBy.change(function() {
		groupIssuesBy(groupBy.val());
	});

	var issues = get_demo_JSON();
	var issueList = $("#main-list-panel-body");
	var table = create_issue_table();

	for (i = 0; i < issues.length; i++) {
		var issue = issues[i];
		table.append(create_new_issue(issue));
	}
	issueList.append(table);
	// for (i = 0; i < issues.length; i++) {
	// 	var issue = issues[i];
	// 	console.log(issue);
	// 	var issue = create_new_issue(issue);
	// 	issueList.append(issue);
	// }
});