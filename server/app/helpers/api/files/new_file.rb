class Server
  module App
    module Helpers

      def new_file( dir_path, file_config )

        file_metadata = file_config[:metadata] || {}

        file = {
          view: :new_file,
          path: "#{ dir_path }/~dir",
          type: file_config[:type],
          config: {
            metadata: file_metadata[:form],
          }
        }

        # For name:
        # Hash is passed, as a JS object, to name input on new_dir form.
        # String is templated.
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
