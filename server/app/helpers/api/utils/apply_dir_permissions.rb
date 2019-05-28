class Server
  module App
    module Helpers

      def apply_dir_permissions( dir_path )

        FileUtils.chmod 'g+sw', dir_path

      end

    end
  end
end
