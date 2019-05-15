class Server
  module App
    module Helpers

      Dir.glob( [ "./server/app/helpers/**/*.rb" ] ).each { |file| require file }

    end
  end
end
