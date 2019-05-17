class Server
  module App
    module Helpers

      def show_directory( behavior, dir_path, dir_config )

        if dir_config[:dirs].is_a?( Hash )
          collect_dirs = {
            type: dir_config[:dirs][:type] || dir_config[:dirs][:key],
            new: dir_config[:dirs][:new] != false
          }
        else
          collect_dirs = false
        end

        if dir_config[:files].is_a?( Hash )
          collect_files = {
            type: dir_config[:files][:type] || dir_config[:files][:key],
            new: dir_config[:files][:new] != false
          }
        else
          collect_files = false
        end

        entries = directory_entries dir_path, dir_config
        parent_path = parent_path_for dir_path
        parent_data = load_dir_data parent_path
        name = File.basename dir_path
        path = "#{ dir_path }/~dir"
        fs_path = dir_path.sub( /^[^\/]+\//, '' )

        if behavior === :collection
          dir_data = parent_data[ name ] || {}
          label = dir_data[:label] || name
          type = dir_config[:type]
          description = dir_data[:description]
        else
          label = dir_config[:label] || dir_config[:name]
          description = dir_config[:description]
        end

        dir = {
          path: path,
          dirname: name,
          label: label,
          collect: { dirs: collect_dirs, files: collect_files },
          type: type,
          view: :show_dir,
          entries: entries,
          description: description,
          order: dir_config[:order],
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

          metadata_config = dir_config[:metadata] || {}
          if metadata_config[:show]
            dir[:metadata] = {
              as: metadata_config[:as] || "list",
              object: dir_data[:metadata]
            }
          end

          dir[:created] = dir_data[:created]
        end

        dir

      rescue Errno::ENOENT

        name = dir_path.match( /([^\/]+)$/ )
        raise Error.new( "#{ name } does not exist.", 404 )

      end

    end
  end
end
