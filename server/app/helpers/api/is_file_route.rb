class Server
  module App
    module Helpers

      def is_file_route( path )

        File.file? "#{ Server.fs_dir }/#{ path }"

      end

    end
  end
end
