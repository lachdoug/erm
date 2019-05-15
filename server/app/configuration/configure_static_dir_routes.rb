class Server
  module App
    module Configuration

      def configure_static_dir_routes( scope, dir_config )

        name = dir_config[:name] || dir_config[:label].downcase.gsub( ' ', '_' )
        route = "#{ scope }/#{ name }"

        get "#{ route }/~dir/?" do
          dir_path = path_for request, "/~dir"
          show_directory :static, dir_path, dir_config
        end

        configure_dir_routes route, dir_config

      end



    end
  end
end
