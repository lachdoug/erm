class Server
  module App
    module Helpers

      def show_directory( behavior, dir_path, dir_config )

        if dir_config[:dirs].is_a?( Hash )
          collect_dirs = {
            key: dir_config[:dirs][:key],
            new: dir_config[:dirs][:new] != false
          }
        else
          collect_dirs = false
        end

        if dir_config[:files].is_a?( Hash )
          collect_files = {
            key: dir_config[:files][:key],
            new: dir_config[:files][:new] != false
          }
        else
          collect_files = false
        end

        entries = directory_entries dir_path, dir_config

        parent_path = parent_path_for dir_path

        parent_data = load_dir_data parent_path
        # dir_id = entry_id "#{ Server.fs_dir }/#{ dir_path }"

        name = File.basename dir_path

        path = URI.encode( "#{ dir_path }/~dir" )
        fs_path = URI.encode( dir_path.sub( /^[^\/]+\//, '' ) )

        if behavior === :static
          description = dir_config[:description]
        else
          dir_data = parent_data[ name ] || {}
          description = dir_data[:description]
        end
# debugger
        dir = {
          path: path,
          dirname: name,
          collect: { dirs: collect_dirs, files: collect_files },
          type: :show_dir,
          entries: entries,
          # dir_id: dir_id,
          description: description,
          # key: ,
          order: dir_config[:order],
          # config: dir_config,
        }

        if behavior === :collection

          editable = if dir_config[:edit] === false
            false
          else
            templated_name = dir_config[:name].is_a? String
            has_metadata = !!( dir_config[:metadata] && dir_config[:metadata].length )
            !templated_name || has_metadata
          end

          dir[:item] = {
            edit: editable,
            delete: ( dir_config[:delete] != false ),
          }
          dir[:label] = dir_config[:label] || dir_config[:key]

          metadata_config = dir_config[:metadata] || {}
          if metadata_config[:show]
            dir[:metadata] = {
              as: metadata_config[:as] || "list",
              object: dir_data[:metadata]
            }
          end

          dir[:created] = dir_data[:created]

        else
          dir[:label] = dir_config[:name] # dir_config[:label] || dir_config[:name]
        end

        dir

      rescue Errno::ENOENT

        name = dir_path.match( /([^\/]+)$/ )
        raise ApiError.new( "#{ name } does not exist.", 404 )

      end

    end
  end
end
