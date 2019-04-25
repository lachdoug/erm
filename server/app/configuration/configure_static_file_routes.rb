class Server
  module App
    module Configuration

      def configure_static_file_routes( scope, file_config )

        route = "#{ scope }/#{ file_config[:key] }#{ file_config[:ext] ? ".#{ file_config[:ext] }" : '' }"

        get "#{ route }/~file/?" do
          file_path = path_for request, "/~file"
          show_file :static, file_path, file_config
        end

        get "#{ route }/~file/raw/?" do
          file_path = path_for request, '/~file/raw'
          show_raw_file :static, file_path, file_config
        end

        get "#{ route }/~file/raw/edit/?" do
          file_path = path_for request, '/~file/raw/edit'
          edit_raw_file :static, file_path, file_config
        end

        post "#{ route }/~file/raw/?" do
          file_path = path_for request, '/~file/raw'
          update_raw_file :static, file_path, file_config, params[:file]
        end

        post "#{ route }/~file/meta/?" do
          file_path = path_for request, '/~file/meta'
          update_file_meta file_path, file_config, params[:file]
        end

        get "#{ route }/~file/meta/edit/?" do
          file_path = path_for request, '/~file/meta/edit'
          edit_file_meta file_path, file_config
        end


      end

    end
  end
end
