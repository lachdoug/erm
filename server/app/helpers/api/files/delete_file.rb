class Server
  module App
    module Helpers

      def delete_file( file_path, file_config )

        name = file_path.split('/').last

        {
          type: :delete_file,
          filename: name,
          label: file_config[:label] || file_config[:key],
          path: "#{ file_path }/~file",
          # key: file_config[:key],
        }

      end

    end
  end
end
