class Server
  module App
    module Configuration

      def configure_collection_dir_routes( scope, dir_config )

        collection_route = scope

        get "#{ collection_route }/~dir/subdir/new/?" do
          dir_path = path_for request, '/~dir/subdir/new'
          new_directory dir_path, dir_config
        end

        post "#{ collection_route }/~dir/subdir/?" do
          dir_path = path_for request, "/~dir/subdir"
          create_directory dir_path, dir_config, params[:dir]
        end

        subdir_route = "#{ collection_route }/:#{ dir_config[:key].downcase.gsub ' ', '_' }"

        post "#{ subdir_route }/~dir/?" do
          dir_path = path_for request, '/~dir'
          update_directory dir_path, dir_config, params[:dir]
        end

        get "#{ subdir_route }/~dir/edit/?" do
          dir_path = path_for request, '/~dir/edit'
          edit_directory dir_path, dir_config
        end

        get "#{ subdir_route }/~dir/delete/?" do
          dir_path = path_for request, '/~dir/delete'
          delete_directory dir_path, dir_config
        end

        get "#{ subdir_route }/~dir/?" do
          dir_path = path_for request, "/~dir"
          show_directory :collection, dir_path, dir_config
        end

        delete "#{ subdir_route }/~dir/?" do
          dir_path = path_for request, "/~dir"
          destroy_directory dir_path, dir_config
        end

        configure_dir_routes subdir_route, dir_config

      end

    end
  end
end
