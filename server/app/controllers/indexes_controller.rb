class Server
  module App
    module Controllers

      get [ '/', '/volumes' ] do
        redirect '/volumes/~dir'
      end

      get [ '/volumes/**', '/sign_in' ] do
        content_type :html
        erb :'index.html'
      end

    end
  end
end
