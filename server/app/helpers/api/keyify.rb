class Server
  module App
    module Helpers

      def keyify( name )

        return name.downcase.gsub( /\s/, '_')

      end

    end
  end
end
