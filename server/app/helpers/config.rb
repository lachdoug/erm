class Server
  module App
    module Helpers

      def config
        $erm_config ||= ( symbolize_keys load_yaml( "config/erm.yaml" ) ) || {}
      rescue Errno::ENOENT
        {}
      end

      end
    end
  end
