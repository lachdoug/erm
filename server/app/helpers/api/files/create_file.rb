class Server
  module App
    module Helpers

      def create_file( parent_path, file_config, file_params )

        file_params ||= {}
        file_ext = file_config[:ext] ? ".#{ file_config[:ext] }" : ''

        created = Time.now
        created_milliseconds = created.to_f * 1000

        if file_config[:index]
          index = increment_index parent_path
        end

        if file_config[:name].is_a? String
          name_template_params = {
            created: created.strftime("%F %T"),
            env: settings.env_template_params,
          }

          if file_config[:index]
            name_template_params[:index] = index
          end

          name_template_params.merge!( file_params[:metadata] || {} )

          name_template = file_config[:name]

          name = process_template name_template, name_template_params
        else
          name = file_params[:name]
        end

        raise ApiError.new( "Requires a name.", 422 ) unless name

        file_name = "#{ name }#{ file_ext }"

        new_file_path = "#{ parent_path }/#{ file_name }"

        entry_path = "#{ Server.fs_dir }/#{ new_file_path }"

        if file_config[:seed] || file_config[:content]
          content_template_params = {
            name: name,
            filename: file_name,
            ext: file_config[:ext],
            path: new_file_path,
            fs_path: new_file_path.sub( /^[^\/]+\//, '' ),
            index: index,
            created: created.strftime("%F %T"),
            keys: params.tap { |result| result.delete :file }.to_h,
            metadata: file_params[:metadata] || {},
            env: settings.env_template_params,
          }
          content = process_template(
            file_config[:seed] || file_config[:content],
            content_template_params
          )
        else
          content = ''
        end

        write_file entry_path, content
        apply_file_permissions entry_path

        file_id = entry_id entry_path

        if file_config[:description]
          description_template_params = {
            name: name,
            filename: file_name,
            ext: file_config[:ext],
            path: new_file_path,
            fs_path: new_file_path.sub( /^[^\/]+\//, '' ),
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

        parent_data = load_dir_data parent_path
        # file_id = entry_file_id entry_path
        file_data = {
          created: created_milliseconds,
          metadata: file_params[:metadata].to_h,
        }
        file_data[:name] = file_params[:name] unless file_config[:name].is_a? String
        file_data[:index] = index if index
        file_data[:description] = description if description

        parent_data[ file_name ] = file_data
        save_dir_data parent_path, parent_data

        {
          type: :create_file,
          path: "#{ new_file_path }/~file"
        }

      rescue Errno::EEXIST

        raise ApiError.new( "#{ name } already exists.", 409 )

      end

    end
  end
end
