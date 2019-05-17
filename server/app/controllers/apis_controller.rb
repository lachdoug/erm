class Server
  module App
    module Controllers

      get "/api/volumes/~dir/?" do
        show_mounts config[:mount] || []
      end

    end
  end
end
