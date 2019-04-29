class Server
  module App
    module Helpers

      def apply_file_permissions( file_path )

        FileUtils.chmod 'g+w', file_path

      end

    end
  end
end
