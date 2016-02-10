require 'sinatra'

set :public_folder, File.dirname(__FILE__) + '/app'

get '/' do
   send_file 'app/index.html'
end

get '/uberprojects' do
   {:id => 'a'}
end


