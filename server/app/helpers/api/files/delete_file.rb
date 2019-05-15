class Server
  module App
    module Helpers

      def delete_file( file_path, file_config )

        name = file_path.split('/').last
        parent_data = load_dir_data( parent_path_for( file_path ) ) || {}
        file_data = parent_data[ name ] || {}

        {
          view: :delete_file,
          filename: name,
          label: file_data[:label] || name.split('.')[0],
          type: file_config[:type],
          path: "#{ file_path }/~file",
        }

      end

    end
  end
end
