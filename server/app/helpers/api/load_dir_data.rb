class Server
  module App
    module Helpers

      def load_dir_data( path )

        load_yaml( "#{ Server.fs_dir }/#{ path }/.erm.data" )

      rescue Errno::ENOENT

        {}

      end

    end
  end
end
