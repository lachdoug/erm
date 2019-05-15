class Server
  module App
    module Helpers

      def update_directory( dir_path, dir_config, dir_params )

        dir_params ||= {}
        name = File.basename dir_path

        parent_path = parent_path_for dir_path
        parent_data = load_dir_data parent_path
        dir_data = parent_data[ name ] || {}
        created = Time.at( dir_data[:created].to_i / 1000 )

        if dir_config[:name].is_a? String
          name_template_params = {
            created: created.strftime("%F %T"),
            env: settings.env_template_params,
          }

          if dir_config[:index]
            index = dir_data[:index]
            name_template_params[:index] = index
          end

          name_template_params.merge!( dir_params[:metadata] || {} )

          name_template = dir_config[:name]

          new_name = process_template name_template, name_template_params
        else
          new_name = dir_params[:name]
        end

        raise ApiError.new( "Requires a name.", 422 ) unless new_name

        if dir_config[:labeled]
          label = new_name
          new_name = new_name.downcase.gsub( ' ', '_' )
        end

        new_dir_path = "#{ parent_path }/#{ new_name }"
        new_entry_path = "#{ Server.fs_dir }/#{ new_dir_path }"
        move_entry "#{ Server.fs_dir }/#{ dir_path }", new_entry_path

        dir_id = entry_id new_entry_path

        if dir_config[:description]
          description_template_params = {
            name: new_name,
            path: new_dir_path,
            fs_path: new_dir_path.sub( /^[^\/]+\//, '' ),
            inode: dir_id,
            index: index,
            created: created.strftime("%F %T"),
            keys: params.tap { |result| result.delete :dir }.to_h,
            metadata: dir_params[:metadata] || {},
            env: settings.env_template_params,
          }
          description = process_template(
            dir_config[:description],
            description_template_params
          )
        end

        parent_data = load_dir_data parent_path
        dir_data = parent_data[ name ] || {}
        dir_data[:metadata] = dir_params[:metadata].to_h
        dir_data[:label] = label if label
        dir_data[:description] = description if description
        parent_data.delete name
        parent_data[ new_name ] = dir_data
        save_dir_data parent_path, parent_data

        {
          view: :update_dir,
          path: "#{ new_dir_path }/~dir",
        }

      rescue Errno::ENOENT

        name = dir_path.match( /([^\/]+)$/ )
        raise ApiError.new( "#{ name } does not exist.", 404 )

      end

    end
  end
end
