class Server
  module App
    module Controllers

      get '/' do
        content_type :html
        erb :'index.html'
      end

    end
  end
end
