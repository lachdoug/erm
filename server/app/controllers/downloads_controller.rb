class Server
  module App
    module Controllers

      get '/download/**' do
        path = ".#{ request.path_info.sub( /^\/download/, '') }"
        raise Error.new( "Not a file.", 422 ) unless File.file? path
        send_file path
      end

    end
  end
end
