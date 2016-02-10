require_relative 'engine.rb'


engine = YellowHat::Engine.new (YellowHat::Config.new('config/uberprojects.yaml'))

puts engine.collect('pdk')