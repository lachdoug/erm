class Server
  module App
    module Helpers

      def entry_id( path )

        File.stat( path ).ino

      end

    end
  end
end
