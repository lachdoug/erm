class Server
  module App
    module Configuration

      def configure_collection_file_routes( scope, file_config )

        collection_route = scope

        get "#{ collection_route }/~dir/file/new/?" do
          dir_path = path_for request, '/~dir/file/new'
          new_file dir_path, file_config
        end

        post "#{ collection_route }/~dir/file/?" do
          dir_path = path_for request, '/~dir/file'
          create_file dir_path, file_config, params[:file]
        end

        item_route = "#{ scope }/:#{ file_config[:key].downcase.gsub ' ', '_' }"

        get "#{ item_route }/~file/raw/?" do
          file_path = path_for request, '/~file/raw'
          show_raw_file :collection, file_path, file_config
        end

        get "#{ item_route }/~file/raw/edit/?" do
          file_path = path_for request, '/~file/raw/edit'
          edit_raw_file :collection, file_path, file_config
        end

        post "#{ item_route }/~file/raw/?" do
          file_path = path_for request, '/~file/raw'
          update_raw_file :collection, file_path, file_config, params[:file]
        end

        post "#{ item_route }/~file/?" do
          file_path = path_for request, '/~file'
          update_file file_path, file_config, params[:file]
        end

        get "#{ item_route }/~file/edit/?" do
          file_path = path_for request, '/~file/edit'
          edit_file file_path, file_config
        end

        get "#{ item_route }/~file/delete/?" do
          file_path = path_for request, '/~file/delete'
          delete_file file_path, file_config
        end

        get "#{ item_route }/~file/?" do
          file_path = path_for request, '/~file'
          show_file :collection, file_path, file_config
        end

        delete "#{ item_route }/~file/?" do
          file_path = path_for request, '/~file'
          destroy_file file_path, file_config
        end

      end

    end
  end
end
