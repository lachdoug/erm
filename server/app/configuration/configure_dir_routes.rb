class Server
  module App
    module Configuration

      def configure_dir_routes( scope, dir_config )

        get "#{ scope }/~dir/order/edit/?" do
          dir_path = path_for request, '/~dir/order/edit'
          edit_directory_order dir_path, dir_config
        end

        post "#{ scope }/~dir/order/?" do
          dir_path = path_for request, "/~dir/order"
          update_directory_order dir_path, dir_config, params[:dir]
        end

        if dir_config[:dirs].is_a? Array
          dir_config[:dirs].each do |subdir_config|
            configure_static_dir_routes scope, subdir_config
          end
        elsif dir_config[:dirs].is_a? Hash
          configure_collection_dir_routes scope, dir_config[:dirs]
        elsif dir_config[:dirs]
          # debugger
        end

        if dir_config[:files].is_a? Array
          dir_config[:files].each do |file_config|
            configure_static_file_routes scope, file_config
          end
        elsif dir_config[:files].is_a? Hash
          configure_collection_file_routes scope, dir_config[:files]
        elsif dir_config[:files]
          # debugger
        end

      end

    end
  end
end
