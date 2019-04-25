class Server
  module App
    module Controllers

      extend Sinatra::Extension
      extend App::Configuration
      include Models
      include Services

      Dir.glob( [ "./server/app/controllers/**/*.rb" ] ).each do |file|
        require file
      end

    end
  end
end
