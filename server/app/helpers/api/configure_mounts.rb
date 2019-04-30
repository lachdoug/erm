class Server
  module App
    module Helpers

      def configure_mounts( mounts_config )

        mounts_config.each do |root_config|
          root = root_config[:name] # || root_config[:key]
          configure_static_dir_routes  "/api", root_config
          build_dirs_entries root, root_config
        end

      end

    end
  end
end
