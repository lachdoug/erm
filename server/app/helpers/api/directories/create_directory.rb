class Server
  module App
    module Helpers

      def create_directory( parent_path, dir_config, dir_params )

        dir_params ||= {}

        created = Time.now
        created_milliseconds = created.to_f * 1000

        if dir_config[:index]
          index = increment_index parent_path
        end

        if dir_config[:name].is_a? String
          name_template_params = {
            created: created.strftime("%F %T"),
            env: settings.env_template_params,
          }

          if dir_config[:index]
            name_template_params[:index] = index
          end

          name_template_params.merge!( dir_params[:metadata] || {} )

          name_template = dir_config[:name]

          name = process_template name_template, name_template_params
        else
          name = dir_params[:name]
        end

        raise Error.new( "Requires a name.", 422 ) unless name

        if dir_config[:labeled]
          label = name
          name = name.downcase.gsub( ' ', '_' )
        end

        dir_path = "#{ parent_path }/#{ name }"
        entry_path = dir_path

        make_directory entry_path
        apply_dir_permissions entry_path
        build_dirs_entries dir_path, dir_config

        dir_id = entry_id entry_path

        if dir_config[:description]
          fs_path = dir_path.sub( /^[^\/]+\//, '' )
          description_template_params = {
            name: name,
            label: label,
            path: dir_path,
            fs_path: dir_path.sub( /^[^\/]+\//, '' ),
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
        dir_data = {
          created: created_milliseconds,
          metadata: dir_params[:metadata].to_h,
        }
        dir_data[:index] = index if index
        dir_data[:label] = label if label
        dir_data[:description] = description if description
        parent_data[ name ] = dir_data
        save_dir_data parent_path, parent_data

        {
          view: :create_dir,
          path: "#{ dir_path }/~dir"
        }

      rescue Errno::EEXIST

        raise Error.new( "#{ name } already exists.", 409 )

      end

    end
  end
end
