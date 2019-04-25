class Server
  module App
    module Helpers

      require 'uri'

      def path_for( request, action='' )

        path = request.path_info.chomp action

        URI.unescape path.sub(/^\/api\//, '')

      end

    end
  end
end
