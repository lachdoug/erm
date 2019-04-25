class Server
  module App
    module Helpers

      # extend Sinatra::Extension
      # extend App::Configuration

      Dir.glob( [ "./server/app/helpers/**/*.rb" ] ).each { |file| require file }

    end
  end
end
