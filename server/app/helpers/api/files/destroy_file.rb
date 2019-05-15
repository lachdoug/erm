class Server
  module App
    module Helpers

      def destroy_file( file_path, file_config )

        file_name = File.basename file_path

        entry_path = "#{ Server.fs_dir }/#{ file_path }"
        apply_file_permissions entry_path

        remove_entry entry_path

        parent_path = parent_path_for file_path
        dir_data = load_dir_data parent_path
        dir_data.delete file_name
        save_dir_data parent_path, dir_data

        {
          view: :destroy_file,
          path: "#{ parent_path }/~dir",
        }

      rescue Errno::ENOENT

        name = file_path.match( /([^\/]+)$/ )
        raise ApiError.new( "#{ name } does not exist.", 404 )

      end
    end
  end
end
