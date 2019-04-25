class Server
  module App
    module Helpers

      def write_file( file_path, content )

        File.write file_path, content

      end

    end
  end
end
