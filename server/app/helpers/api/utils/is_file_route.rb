class Server
  module App
    module Helpers

      def is_file_route( path )

        File.file? path

      end

    end
  end
end
