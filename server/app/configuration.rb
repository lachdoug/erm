class Server
  module App

    module Configuration

      include Helpers

      Dir["./server/app/configuration/*.rb"].each do |file|
        require file
      end

      def configure_erm

        configure_mounts( config[:mount] || [] )

      end

    end
  end
end
