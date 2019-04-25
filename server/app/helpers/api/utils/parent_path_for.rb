class Server
  module App
    module Helpers

      def parent_path_for( entry_path )

        entry_path.sub( /\/[^\/]+$/, '' )

      end

    end
  end
end
