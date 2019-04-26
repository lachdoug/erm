class Server
  module App
    module Helpers

      def update_raw_file( behavior, file_path, file_config, file_params )

        entry_path = "#{ Server.fs_dir }/#{ file_path }"

        write_file entry_path, file_params[:contents]

        {
          type: :update_raw_file,
          path: URI.encode( "#{ file_path }/~file" )
        }

      rescue Errno::ENOENT

        name = file_path.match( /([^\/]+)$/ )
        raise ApiError.new( "#{ name } does not exist.", 404 )

      end

    end
  end
end