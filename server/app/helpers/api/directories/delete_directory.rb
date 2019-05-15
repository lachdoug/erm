class Server
  module App
    module Helpers

      def delete_directory( dir_path, dir_config )

        name = dir_path.split('/').last

        parent_path = parent_path_for dir_path
        parent_data = load_dir_data parent_path
        dir_data = parent_data[ name ] || {}

        {
          view: :delete_dir,
          dirname: name,
          label: dir_data[:label] || name,
          type: dir_config[:type],
          path: "#{ dir_path }/~dir",
        }

      end

    end
  end
end
