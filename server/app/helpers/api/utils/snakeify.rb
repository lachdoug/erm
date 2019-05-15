class Server
  module App
    module Helpers

      def snakeify( name )

        return name.downcase.gsub( ' ', '_' )

      end

    end
  end
end
