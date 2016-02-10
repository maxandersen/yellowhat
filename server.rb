require 'sinatra'
require 'sinatra/json'
require_relative 'engine.rb'

engine = YellowHat::Engine.new (YellowHat::Config.new('config/uberprojects.yaml'))

set :bind, '0.0.0.0'
set :public_folder, File.dirname(__FILE__) + '/app'

get '/' do
   send_file 'app/index.html'
end

get '/uberprojects' do
   json engine.uber_projects
end

get '/uberprojects/:id' do
   id = params['id']
   unless id
      status 404
      body({'type' => 'error', 'message' => 'not_found'})
      return
   end
   data = engine.collect(id)
   return json({'type' => 'error', 'message' => 'unknown_uber_project'}) if data.nil?
   json data
end


