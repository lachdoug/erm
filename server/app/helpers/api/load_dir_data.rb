class Server
  module App
    module Helpers

      def load_dir_data( path )

        load_yaml( "#{ path }/.erm.data" ) || {}

      rescue Errno::ENOENT

        {}

      end

    end
  end
end
