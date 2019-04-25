class Server
  module App
    module Helpers

      def delete_directory( dir_path, dir_config )

        name = dir_path.split('/').last

        {
          type: :delete_dir,
          dirname: name,
          label: dir_config[:label] || dir_config[:key],
          path: URI.encode( "#{ dir_path }/~dir" ),
          key: dir_config[:key],
          # config: dir_config
        }

      end

    end
  end
end
