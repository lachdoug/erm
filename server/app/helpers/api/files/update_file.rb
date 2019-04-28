class Server
  module App
    module Helpers

      def update_file( file_path, file_config, file_params )

        file_params ||= {}

        parent_path = parent_path_for file_path
        parent_data = load_dir_data( parent_path ) || {}

        name = File.basename file_path

        file_data = parent_data[ name ] || {}

        if file_data[:created]
          created = Time.at(
            file_data[:created] / 1000 ).strftime("%F %T")
        else
          created = ''
        end

        if file_config[:name].is_a? String

          name_template_params = {
            created: created,
            env: settings.env_template_params,
          }

          if file_config[:index]
            index = file_data[:index]
            name_template_params[:index] = index
          end

          name_template_params.merge!( file_params[:metadata] || {} )

          name_template = file_config[:name]

          new_name = process_template name_template, name_template_params

        else
          new_name = file_params[:name]
        end

        raise ApiError.new( "Requires a name.", 422 ) unless new_name

        if file_config[:ext]
          new_file_name = "#{ new_name }.#{ file_config[:ext] }"
        else
          new_file_name = new_name
        end

        new_file_path = "#{ parent_path }/#{ new_file_name }"
        new_entry_path = "#{ Server.fs_dir }/#{ new_file_path }"
        move_entry "#{ Server.fs_dir }/#{ file_path }", new_entry_path

        if file_config[:content]
          content_template_params = {
            name: new_name,
            filename: new_file_name,
            ext: file_config[:ext],
            path: URI.encode( new_file_path ),
            fs_path: URI.encode( new_file_path.sub( /^[^\/]+\//, '' ) ),
            index: index,
            created: created,
            keys: params.tap { |result| result.delete :file }.to_h,
            metadata: file_params[:metadata] || {},
            env: settings.env_template_params,
          }
          content = process_template(
            file_config[:content],
            content_template_params
          )
          write_file( new_entry_path, content )
        end

        file_id = entry_id new_entry_path

        if file_config[:description]
          description_template_params = {
            name: new_name,
            filename: new_file_name,
            ext: file_config[:ext],
            path: URI.encode( new_file_path ),
            fs_path: URI.encode(
              new_file_path.sub( /^[^\/]+\//, '' )
            ),
            inode: file_id,
            index: index,
            created: created.strftime("%F %T"),
            keys: params.tap { |result| result.delete :file }.to_h,
            metadata: file_params[:metadata] || {},
            env: settings.env_template_params,
          }
          description = process_template(
            file_config[:description],
            description_template_params
          )
        end

        new_filename = new_name + ( file_config[:ext] ? ".#{ file_config[:ext] }" : '' )

        parent_data = load_dir_data( parent_path ) || {}
        file_data = parent_data[ name ] || {}
        file_data[:name] = file_params[:name] unless file_config[:name].is_a? String
        file_data[:metadata] = file_params[:metadata].to_h
        file_data[:description] = description if description
        parent_data.delete name
        parent_data[ new_filename ] = file_data
        save_dir_data parent_path, parent_data

        {
          type: :update_file,
          path: URI.encode( "#{ new_file_path }/~file" )
        }

      rescue Errno::ENOENT

        name = file_path.match( /([^\/]+)$/ )
        raise ApiError.new( "#{ name } does not exist.", 404 )

      end

    end
  end
end
