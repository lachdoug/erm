class Server
  module App
    module Controllers

      get [ "/api/?", "/api/~dir/?" ] do
        show_mounts config[:mount] || []
      end

    end
  end
end
