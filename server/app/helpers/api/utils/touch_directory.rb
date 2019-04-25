class Server
  module App
    module Helpers

      def touch_directory( dir_path )

        Dir.mkdir( dir_path ) unless File.exist? dir_path

      end

    end
  end
end
