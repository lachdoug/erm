class Server
  module App
    module Helpers

      def edit_file( file_path, file_config )

        name = File.basename file_path
        parent_data = load_dir_data( parent_path_for( file_path ) ) || {}
        file_data = parent_data[ name ] || {}
        metadata_config = file_config[:metadata] || {}

        if file_config[:ext]
          name = name.chomp( ".#{ file_config[:ext] }" )
        end

        file = {
          view: :edit_file,
          label: file_data[:label] || name,
          type: file_config[:type],
          metadata: file_data[:metadata] || {},
          path: "#{ file_path }/~file",
          config: {
            metadata: metadata_config[:form],
          },
        }

        if file_config[:name].is_a? Hash
          file[:config][:name] = file_config[:name]
          file[:name] = file_data[:label] || name
        elsif file_config[:name].is_a? String
          file[:config][:name] = false
        else
          file[:config][:name] = {}
          file[:name] = file_data[:label] || name
        end

        file

      end

    end
  end
end
