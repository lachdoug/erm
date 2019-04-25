class Server
  module App
    module Services
      Dir.glob( [ "./server/app/services/**/*.rb" ] ).each { |file| require file }
    end
  end
end
