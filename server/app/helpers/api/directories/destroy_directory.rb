class Server
  module App
    module Helpers

      def destroy_directory( dir_path, dir_config )

        dir_id = entry_id "#{ Server.fs_dir }/#{ dir_path }"

        remove_entry "#{ Server.fs_dir }/#{ dir_path }"

        parent_path = parent_path_for dir_path
        parent_data = load_dir_data parent_path
        parent_data.delete dir_id
        save_dir_data parent_path, parent_data

        {
          type: :delete_dir,
          path: URI.encode( "#{ parent_path }/~dir" )
        }

      rescue Errno::ENOENT

        name = dir_path.match( /([^\/]+)$/ )
        raise ApiError.new( "#{ name } does not exist.", 404 )

      end
    end
  end
end
