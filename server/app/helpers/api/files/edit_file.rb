class Server
  module App
    module Helpers

      def edit_file( file_path, file_config )

        name = File.basename file_path
        parent_data = load_dir_data( parent_path_for( file_path ) ) || {}
        # file_id = entry_id "#{ Server.fs_dir }/#{ file_path }"
        file_data = parent_data[ name ] || {}
        metadata_config = file_config[:metadata] || {}

        if file_config[:ext]
          name = name.chomp( ".#{ file_config[:ext] }" )
        end

        file = {
          type: :edit_file,
          # name: file_data[:name],
          label: file_config[:label] || file_config[:key],
          metadata: file_data[:metadata] || {},
          path: URI.encode( "#{ file_path }/~file" ),
          config: {
            metadata: metadata_config[:form],
          },
          # config: file_config,
        }

        if file_config[:name].is_a? Hash
          file[:config][:name] = file_config[:name]
          file[:name] = file_data[:name] || ''
        elsif file_config[:name].is_a? String
          file[:config][:name] = false
        else
          file[:config][:name] = {}
          file[:name] = file_data[:name] || ''
        end

        file

      end

    end
  end
end
