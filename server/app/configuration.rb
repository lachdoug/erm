class Server
  module App

    # if :dirs is hash then subdirs are collection items
    # if :dirs is array then subdirs are singleton items
    # if :dirs is false|nil|undefined then no subdirs
    # if :dirs is true then user subdirs
    # if :files is hash then contained files are collection items
    # if :files is array then contained files are singleton items
    # if :files is false|nil|undefined then no contained files
    # if :files is true then user files

    module Configuration
      include Helpers

      Dir["./server/app/configuration/*.rb"].each do |file|
        require file
      end

      def configure_erm

        get "/-config" do
          show_config config
        end

        get [ "/api/?", "/api/~dir/?" ] do
          show_mounts config[:mount]
        end

        configure_mounts config[:mount]

      end

    end
  end
end
