require 'yaml'
require 'open3'
require 'json'

module YellowHat
   class Engine
      def initialize(config, options = {:cache_root => 'cache/'})
         @config = config
         @cache = YellowHat::Cache.new options[:cache_root]
      end

      def collect(uber_id)

         uber_config = uber_project(uber_id)
         return nil unless uber_config

         uber = uber_config[uber_id]

         scouts = uber['scouts']
         
         results = []

         scouts.each do |scout|

            scout_name = scout["name"]
            scout_type = scout["type"]
            scout_server = scout["server"]
            scout_username = scout["username"]
            scout_password = scout["password"]
            scout_access_token = scout["access_token"]

            command_line = ""
            command_line = "ruby #{scout_type} #{scout_access_token}" if scout_type.eql? 'scout-github.rb'
            command_line = "python #{scout_type} -s #{scout_server} -q " if scout_type.eql? 'scout-jira.py'
            command_line = "python #{scout_type} -s #{scout_server} -q " if scout_type.eql? 'scout-bugzilla.py'


            queries = scout["queries"]
            queries.each_index do |i|
               cache_key = "#{uber_id}_#{scout_name}_#{i}"

               unless @cache.cached? cache_key
                  query = queries[i]

                  stdin, stdout, stderr = Open3.popen3("#{command_line} \"#{query}\"")
                  error = stderr.read
                  return {'type' => 'error', 'message' => error} if error.size > 0

                  data = stdout.read
                  @cache.write cache_key, data
               end

               result = JSON.parse(@cache.read(cache_key))
               result.each {|res| res["source"] = scout_name}

               results << result

            end
         end

         return results.uniq{|d| d['id']}
      end

      def uber_projects()
         @config.read
      end

      private

      def uber_project(uber_id)
         uber_projects().each { |uber|
            return uber if uber[uber_id]
         }
      end

   end

   class Config
      def initialize(config_file)
         @config_file = config_file
         load()
      end

      def read()
         @config
      end

      private

      def load()
         unless @config
            @config = YAML.load_file @config_file
         end
      end
   end

   class Cache
      def initialize(root)
         @root = root
         Dir.mkdir(root) unless File.exists? root
      end

      def write(key, data)
         File.open(cache_file(key), 'w') {|file| file.write(data)}
      end

      def cached?(key)
         File.exists? cache_file(key)
      end

      def read(key)
         File.read(cache_file(key))
      end

      private

      def cache_file(key)
         File.join(@root, key)
      end 
   end
end
