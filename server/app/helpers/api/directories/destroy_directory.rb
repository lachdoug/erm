class Server
  module App
    module Helpers

      def destroy_directory( dir_path, dir_config )

        # dir_id = entry_id "#{ Server.fs_dir }/#{ dir_path }"
        name = File.basename dir_path

        entry_path = "/#{ dir_path }"
        apply_dir_permissions entry_path

        remove_entry entry_path

        parent_path = parent_path_for dir_path
        parent_data = load_dir_data parent_path
        parent_data.delete name
        save_dir_data parent_path, parent_data

        {
          view: :destroy_dir,
          path: "#{ parent_path }/~dir"
        }

      rescue Errno::ENOENT

        name = dir_path.match( /([^\/]+)$/ )
        raise Error.new( "#{ name } does not exist.", 404 )

      end
    end
  end
end
