class Server
  module App
    module Helpers

      def config
        $erm_config ||= symbolize_keys load_yaml( "config/erm.yaml" )
      end

      end
    end
  end
