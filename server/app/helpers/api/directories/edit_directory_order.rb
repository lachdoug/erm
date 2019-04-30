class Server
  module App
    module Helpers

      def edit_directory_order( dir_path, dir_config )

        entries = directory_entries dir_path, dir_config
        name = dir_path.split('/').last

        {
          type: :edit_dir_order,
          name: name,
          # label: dir_config[:label] || dir_config[:key],
          entries: entries,
          path: "#{ dir_path }/~dir",
          # key: dir_config[:key],
          # config: dir_config
        }

      end

    end
  end
end
