class Server
  module App
    module Helpers

      def new_directory( dir_path, dir_config )

        metadata_config = dir_config[:metadata] || {}

        dir = {
          type: :new_dir,
          path: URI.encode( "#{ dir_path }/~dir" ),
          label: dir_config[:label] || dir_config[:key],
          config: {
            # key: dir_config[:key],
            index: dir_config[:index],
            # name: dir_config[:name],
            # description: dir_config[:description],
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
