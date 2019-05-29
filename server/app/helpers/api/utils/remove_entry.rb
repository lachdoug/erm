class Server
  module App
    module Helpers

      def remove_entry( entry )

        FileUtils.rm_rf entry

      end

    end
  end
end
