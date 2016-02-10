require 'octokit'
require 'json'

def repo_to_project_name(url)
   return url.gsub("https://api.github.com/repos/", "")
end

access_token = ARGV[0]
query = ARGV[1]

exit 99 unless access_token and query

client = Octokit::Client.new(:access_token => access_token)

user = client.user
user.login

query_result = Octokit.search_issues query

result = []
query_result.items.each do |i|

   issue = {
      :id => "github_#{i.id}",
      :native_id => "#{i.number}",
      :status => i.state,
      :native_status => i.state,
      :project => repo_to_project_name(i.repository_url),
      :summary => i.title,
      :weburl => i.html_url
   }

   result.push issue
end

puts JSON.pretty_generate result
