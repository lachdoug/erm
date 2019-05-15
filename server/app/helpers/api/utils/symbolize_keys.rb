class Server
  module App
    module Helpers

      def symbolize_keys( data )

        JSON.parse( data.to_json, symbolize_names: true)

      end

    end
  end
end
