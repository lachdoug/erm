class Server
  module App
    module Helpers

      def new_file( dir_path, file_config )

        file_metadata = file_config[:metadata] || {}

        file = {
          type: :new_file,
          path: URI.encode( "#{ dir_path }/~dir" ),
          label: file_config[:label] || file_config[:key],
          config: {
            metadata: file_metadata[:form],
          }
        }

        if file_config[:name].is_a? Hash
          file[:config][:name] = file_config[:name]
        elsif file_config[:name].is_a? String
          file[:config][:name] = false
        else
          file[:config][:name] = {}
        end

        file

      end

    end
  end
end
