class Server
  module App
    module Helpers

      def new_directory( dir_path, dir_config )

        metadata_config = dir_config[:metadata] || {}

        dir = {
          view: :new_dir,
          path: "#{ dir_path }/~dir",
          type: dir_config[:type],
          config: {
            index: dir_config[:index],
            metadata: metadata_config[:form],
          },
        }

        if dir_config[:name].is_a? Hash
          dir[:config][:name] = dir_config[:name][:field]
        elsif dir_config[:name].is_a? String
          dir[:config][:name] = false
        else
          dir[:config][:name] = {}
        end

        dir

      end

    end
  end
end
