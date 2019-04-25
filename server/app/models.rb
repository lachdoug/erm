class Server
  module App
    module Models
      Dir.glob( [ "./server/app/models/**/*.rb" ] ).each { |file| require file }
    end
  end
end
