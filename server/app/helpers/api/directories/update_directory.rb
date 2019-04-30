class Server
  module App
    module Helpers

      def update_directory( dir_path, dir_config, dir_params )

        dir_params ||= {}

        parent_path = parent_path_for dir_path
        parent_data = load_dir_data parent_path
        # dir_id = entry_id "#{ Server.fs_dir }/#{ dir_path }"
        name = File.basename dir_path
        dir_data = parent_data[ name ] || {}

        created = Time.at( dir_data[:created] / 1000 )

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
        dir_data[:name] = dir_params[:name] unless dir_config[:name].is_a? String
        dir_data[:metadata] = dir_params[:metadata].to_h
        dir_data[:description] = description if description
        parent_data.delete name
        parent_data[ new_name ] = dir_data
        save_dir_data parent_path, parent_data

        {
          type: :update_dir,
          path: "#{ new_dir_path }/~dir",
        }

      rescue Errno::ENOENT

        name = dir_path.match( /([^\/]+)$/ )
        raise ApiError.new( "#{ name } does not exist.", 404 )

      end

    end
  end
end

#
# dir_params ||= {}
#
# now = Time.now
# now_milliseconds = now.to_f * 1000
#
# template_params = {
#   created: now.strftime("%F %T")
# }.merge( dir_params[:metadata] || {} )
#
# if dir_config[:index]
#   index = increment_index dir_path
#   template_params[:index] = index
# end
#
# name = process_template dir_config[:name], template_params
#
# raise ApiError.new( "Requires a name.", 422 ) unless name
#
# new_dir_path = "#{ dir_path }/#{ name }"
# entry_path = "#{ Server.fs_dir }/#{ new_dir_path }"
# make_directory entry_path
# build_dirs_entries new_dir_path, dir_config
#
# metadata = load_metadata dir_path
# dir_id = entry_id entry_path
# metadata[ dir_id ] ||= {}
# metadata[ dir_id ][:created] = now_milliseconds
# metadata[ dir_id ][:metadata] = dir_params[:metadata]
# metadata[ dir_id ][:index] = index if index
# save_metadata dir_path, metadata
#
# {
#   type: :create_dir,
#   path: URI.encode( "#{ new_dir_path }/~dir" )
# }
#
# rescue Errno::EEXIST
#
# raise ApiError.new( "#{ name } already exists.", 409 )
#
# end
