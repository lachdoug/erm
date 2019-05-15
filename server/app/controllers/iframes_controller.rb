class Server
  module App
    module Controllers

      get '/iframe/**' do
        match = request.path_info.match( /^\/iframe(.+)\.(.+)\/~file/ )
        file_content_type = match[2]
        raise ApiError.new( "File requires an extension.", 422 ) unless file_content_type
        file_path = "volumes#{ match[1] }.#{ file_content_type }"
        content_type file_content_type
        File.read file_path
      end

    end
  end
end
