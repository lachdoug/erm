class Server
  module App
    module Helpers

      def update_raw_file( behavior, file_path, file_config, file_params )

        # entry_path = "#{ Server.fs_dir }/#{ file_path }"
        entry_path = file_path

        write_file entry_path, file_params[:contents]

        {
          view: :update_raw_file,
          path: "#{ file_path }/~file",
        }

      rescue Errno::ENOENT

        name = file_path.match( /([^\/]+)$/ )
        raise Error.new( "#{ name } does not exist.", 404 )

      end

    end
  end
end
