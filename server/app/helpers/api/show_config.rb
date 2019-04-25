class Server
  module App
    module Helpers

      def show_config( config )

        "<pre>" + JSON.pretty_generate( config ) + "</pre>"

      end

    end
  end
end
