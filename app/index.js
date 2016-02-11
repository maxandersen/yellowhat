var url = "/uberprojects/pdk";

function create_new_issue(obj) {
    var issue = $("<tr>");
    issue.addClass("issue-tr");

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

function create_issue_table(obj) {
    var table = $("<table>");
    table.addClass("table").addClass("table-hover");
    var tbody = $("<tbody>");
    tbody.append(create_table_header());
    table.append(tbody);
    return table;
}


function create_table_header() {
    var tr = $("<tr>");

    var cols = ["Project", "Id", "Summary", "Status", "Source", "Native Status", "Components"];

    var i;
    for (i = 0; i < cols.length; i++) {
        var th = $("<th>");
        var b = $("<b>");

        b.html(cols[i]);
        th.append(b);
        tr.append(th);
    }

    return tr;
}

function format_components(components) {

    if (components === undefined) {
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

function getProjectIssues(project, objects) {
    return objects.filter(function(val) {
        return val.project == project;
    });
}

function getSourceIssues(source, objects) {
    return objects.filter(function(val) {
        return val.source == source;
    });
}

function getProjectPanel(groupTitle, objects) {
    var issues = getProjectIssues(groupTitle, objects);
    return getGroupedPanel(groupTitle, issues);
}

function getSourcePanel(groupTitle, objects) {
    var issues = getSourceIssues(groupTitle, objects);
    return getGroupedPanel(groupTitle, issues);
}

function getGroupedPanel(panel_name, issues) {
	var panelHeading = $("<div>");
    var panelBody = $("<div>");
    var panel = $("<div>");

    panel.addClass("panel");
    panel.addClass("panel-default");

    panelHeading.addClass("panel-heading");
    panelBody.addClass("panel-body");
    var showIssues = $("<button>");
    showIssues.attr("type", "button");
    showIssues.addClass("btn").addClass("btn-default");
    showIssues.html("Show Issues");
    showIssues.click(function() {
        $('#' + panel_name.replace(/\s/g, '').replace(/\//g, '') + "-table").slideToggle('fast');
    });

    var table = create_issue_table();
    table.hide();
    table.attr("id", panel_name.replace(/\s/g, '').replace(/\//g, '') + "-table");
    for (i = 0; i < issues.length; i++) {
        var issue = issues[i];
        table.append(create_new_issue(issue));
    }

    var statsPanel = getStatsPanel(panel_name, issues);

    panelHeading.html(panel_name);
    panelBody.append(statsPanel);
    panelBody.append(showIssues);
    panelBody.append(table);

    panel.append(panelHeading);
    panel.append(panelBody);

    return panel;
}

function getClosedIssueCount(objects) {
    var closedIssues = objects.filter(function(val) {
        return val.status == "closed";
    });

    return closedIssues.length;
}

function getStatsPanel(projectName, issues) {
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
    if (closedCount === issues.length) {
        progressBar.addClass("progress-bar-success");
    } else if (closedCount === 0) {
        progressBar.addClass("progress-bar-danger");
    } else {
        progressBar.addClass("progress-bar-warning");
    }

    var s = $("<span>");
    s.html(closedCount + " / " + issues.length);
    s.attr("style", "text-align:center; width: 100%; position: absolute;");
    closedBar.append(s);
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

function inArray(item, array) {
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

function groupIssuesByProject(issues) {
    var projects = getProjects(issues);

    var i;
    var issueList = $("#main-list-panel-body");

    for (i = 0; i < projects.length; i++) {
        var projectPanel = getProjectPanel(projects[i], issues);
        issueList.append(projectPanel);
    }

}

function groupIssuesBySource(issues) {
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
    
    var issues = get_demo_JSON();

    switch (key) {
        case "Project":
            groupIssuesByProject(issues);
            break;
        case "Issue":
                groupIssuesByIssue(issues);
            break;
        case "Source":
            groupIssuesBySource(issues);
            break;
    }
}

function groupIssuesByIssue() {
    var issues = get_demo_JSON();
    var issueList = $("#main-list-panel-body");
    var table = create_issue_table();
    var stats = getStatsPanel("", issues);
    issueList.append(stats);
    issues.sort(compareNativeId);
    for (i = 0; i < issues.length; i++) {
        var issue = issues[i];
        table.append(create_new_issue(issue));
    }
    issueList.append(table);
}

function compareNativeId(a, b) {
    if (parseInt(a.native_id) < parseInt(b.native_id)) {
        return -1;
    } else if (parseInt(a.native_id) > parseInt(b.native_id)) {
        return 1;
    }
    return 0;
}

$(document).ready(function() {
    var groupBy = $("#group-by");
    groupBy.change(function() {
        $("#filter").val("");
        groupIssuesBy(groupBy.val());
    });


    $('#filter').keyup(function () {
        var rex = new RegExp($(this).val(), 'i');
        $('.issue-tr').hide();
        $('.issue-tr').filter(function () {
            return rex.test($(this).text());
        }).show();

    });

    groupIssuesByIssue();
});
