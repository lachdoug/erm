class Server
  module App
    module Helpers

      def create_directory( parent_path, dir_config, dir_params )
# debugger
        dir_params ||= {}

        created = Time.now
        created_milliseconds = created.to_f * 1000

        if dir_config[:index]
          index = increment_index parent_path
        end


        if dir_config[:name].is_a? String
          name_template_params = {
            created: created.strftime("%F %T")
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

# debugger
        raise ApiError.new( "Requires a name.", 422 ) unless name

        dir_path = "#{ parent_path }/#{ name }"
        entry_path = "#{ Server.fs_dir }/#{ dir_path }"

        make_directory entry_path
        build_static_dirs dir_path, dir_config

        # path = URI.encode( "#{ entry_path }/~dir" )

        dir_id = entry_id entry_path

        if dir_config[:description]
          fs_path = URI.encode( dir_path.sub( /^[^\/]+\//, '' ) )
          description_template_params = {
            name: name,
            path: URI.encode( dir_path ),
            fs_path: URI.encode( dir_path.sub( /^[^\/]+\//, '' ) ),
            inode: dir_id,
            index: index,
            created: created.strftime("%F %T"),
            keys: params.tap { |result| result.delete :dir }.to_h,
            metadata: dir_params[:metadata] || {}
          }
          description = process_template(
            dir_config[:description],
            description_template_params
          )
        end

        parent_data = load_dir_data parent_path
        # id = entry_id entry_path
        dir_data = parent_data[ dir_id ] || {}
        dir_data[:name] = dir_params[:name] unless dir_config[:name].is_a? String
        dir_data[:created] = created_milliseconds
        dir_data[:metadata] = dir_params[:metadata].to_h
        dir_data[:index] = index if index
        dir_data[:description] = description if description
        parent_data[ dir_id ] = dir_data
        save_dir_data parent_path, parent_data

        {
          type: :create_dir,
          path: URI.encode( "#{ dir_path }/~dir" )
        }

      rescue Errno::EEXIST

        raise ApiError.new( "#{ name } already exists.", 409 )

      end

    end
  end
end
