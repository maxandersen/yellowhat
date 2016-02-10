import bugzilla
from optparse import OptionParser
import json
from common import shared
import urllib
from urlparse import urlparse


def parse_options():
    usage = "Usage: %prog -u <user> -p <password> \nBugzilla Scout"

    parser = OptionParser(usage)
    parser.add_option("-u", "--user", dest="username", help="jira username")
    parser.add_option("-p", "--pwd", dest="password", help="jira password")
    parser.add_option("-s", "--server", dest="server", help="jira instance")
    parser.add_option("-q", "--query", dest="query", help="jira query")
    (options, args) = parser.parse_args()

    return options

options = parse_options()

payload = {'jql': options.query }
data = shared.jiraquery(options.server, options.username, options.password, "/rest/api/2/search?" + urllib.urlencode(payload))

json_issues = []
for bug in data['issues']:
    jq = {}
    jq["id"] = bug['key']


    o = urlparse(bug['self'])
    url = o.scheme + "://" + o.netloc + "/browse/" + jq['id']

    jq["weburl"] = url
    
    fields = bug['fields']

    jq["summary"] = fields['summary']
    jq["project"] = fields['project']['key']

    components = []
    for component in fields['components']:
          components.append({ "name" : component['name'] })
          
    jq["components"] = components
    
    #jq["components"] = [{ "name" : bug.component }] 
    json_issues.append(jq)

print json.dumps(json_issues, sort_keys=True, indent=4)

    
