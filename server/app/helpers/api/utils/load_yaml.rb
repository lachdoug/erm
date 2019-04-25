class Server
  module App
    module Helpers

      def load_yaml( filepath )

        YAML.load_file( filepath )

      end

    end
  end
end
