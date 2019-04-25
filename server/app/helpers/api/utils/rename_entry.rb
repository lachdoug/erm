class Server
  module App
    module Helpers

      def rename_entry( from, to )
# debugger
        File.rename from, to

      end

    end
  end
end
