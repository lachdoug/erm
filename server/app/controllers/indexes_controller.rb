class Server
  module App
    module Controllers

      get '/' do
        # @erm_config = erm_config
        content_type :html
        erb :'index.html'
      end

    end
  end
end
