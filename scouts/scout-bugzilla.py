import bugzilla
from optparse import OptionParser
import json

def parse_options():
    usage = "Usage: %prog -u <user> -p <password> \nBugzilla Scout"

    parser = OptionParser(usage)
    parser.add_option("-u", "--user", dest="username", help="bz username")
    parser.add_option("-p", "--pwd", dest="password", help="bz password")
    parser.add_option("-s", "--server", dest="server", help="bz instance")
    parser.add_option("-q", "--query", dest="query", help="bz query")
    (options, args) = parser.parse_args()

    return options

options = parse_options()

bz = bugzilla.Bugzilla(url=options.server + "/bugs/xmlrpc.cgi")

querystr = options.server + "/bugs/buglist.cgi?" + options.query

queryobj = bz.url_to_query(querystr)

issues = bz.query(queryobj)

statemap = {
      'closed' : 'closed',
      'done' : 'closed',
      'resolved' : 'closed',
      'coding in progress' : 'progress'
    }
    
json_issues = []
for bug in issues:
    jq = {}
    jq["native-id"] = str(bug.id)
    jq["weburl"] = bug.weburl
    jq["id"] = bug.weburl
    jq["summary"] = bug.summary
    jq["project"] = bug.product
    jq["components"] = [{ "name" : bug.component }]

    state = bug.status

    jq["native-state"] = state
    
    if state.lower() in statemap:
        jq["state"] = statemap[state.lower()]
    else:
        jq["state"] = "open"

    json_issues.append(jq)

print json.dumps(json_issues, sort_keys=True, indent=4)
    
