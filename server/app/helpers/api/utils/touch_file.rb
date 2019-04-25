class Server
  module App
    module Helpers

      def touch_file( filepath )

        FileUtils.touch( filepath )

      end

    end
  end
end
