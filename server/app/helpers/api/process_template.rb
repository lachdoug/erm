class Server
  module App
    module Helpers

      require 'mustache'

      def process_template( template, params )
        Mustache.render( template, params )
      end

    end
  end
end
