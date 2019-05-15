class Server
  module App
    module Helpers

      def edit_directory_order( dir_path, dir_config )

        name = dir_path.split('/').last

        parent_path = parent_path_for dir_path
        parent_data = load_dir_data parent_path
        dir_data = parent_data[ name ] || {}

        entries = directory_entries dir_path, dir_config

        {
          view: :edit_dir_order,
          label: dir_data[:label] || name,
          entries: entries,
          path: "#{ dir_path }/~dir",
        }

      end

    end
  end
end
