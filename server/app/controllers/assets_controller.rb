class Server
  module App
    module Controllers

      get '/assets/client.js' do
        content_type :'application/javascript'
        @distribution = App::Services::Distribution.new
        @distribution.client
      end

    end
  end
end
