class Server
  module App
    module Helpers

      def destroy_file( file_path, file_config )

        # file_id = entry_id "#{ Server.fs_dir }/#{ file_path }"
        file_name = File.basename file_path

        remove_entry "#{ Server.fs_dir }/#{ file_path }"

        parent_path = parent_path_for file_path
        dir_data = load_dir_data parent_path
        dir_data.delete file_name
        save_dir_data parent_path, dir_data

        {
          type: :destroy_file,
          path: "#{ parent_path }/~dir",
          # key: file_config[:key],
        }

      rescue Errno::ENOENT

        name = file_path.match( /([^\/]+)$/ )
        raise ApiError.new( "#{ name } does not exist.", 404 )

      end
    end
  end
end
