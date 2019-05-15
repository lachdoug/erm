class Server
  module App
    module Helpers

      def remove_entry( entry )

        FileUtils.rm_r entry

      end

    end
  end
end
