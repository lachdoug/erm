class Server
  module App
    module Helpers

      # require 'fileutils'

      def remove_entry( entry )

        FileUtils.rm_r entry

      end

    end
  end
end
