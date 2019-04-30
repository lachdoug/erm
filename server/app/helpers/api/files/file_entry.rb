class Server
  module App
    module Helpers

      def file_entry( behavior, file_path, file_config )

        entry_path = "#{ Server.fs_dir }/#{ file_path }"

        dir_path = parent_path_for file_path
        dir_data = load_dir_data( dir_path ) || {}

        # key = File.basename entry_path, '.*'
        name = File.basename entry_path
        path = file_path
        file_id = entry_id entry_path
        modified = File.mtime( entry_path ).to_f * 1000

        file_data = dir_data[ name ] || {}

        if behavior === :collection
          description = file_data[:description]
          label = file_config[:label] || file_config[:key]
        else
          description = file_config[:description]
          label = file_config[:name]
        end

        file = {
          path: "#{ file_path }/~file",
          filename: name,
          ext: file_config[:ext],
          label: label,
          # file_id: file_id,
          description: description || '',
          metadata: file_data[:metadata],
          index: file_data[:index],
          created: file_data[:created],
          modified: modified,
          raw: ( file_config[:raw] != false ),
          editor: ( file_config[:editor] != false ),
          # raw: ( file_config[:raw] != false ),
          # config: file_config,
        }

        if behavior === :collection

          editable = if file_config[:edit] === false
            false
          else
            templated_name = file_config[:name].is_a? String
            has_metadata = !!( file_config[:metadata] && file_config[:metadata].length )
            !templated_name || has_metadata
          end

          file[:item] = {
            edit: editable,
            delete: ( file_config[:delete] != false ),
          }
          file[:created] = file_data[:created]
        end

        file

      end

    end
  end
end
