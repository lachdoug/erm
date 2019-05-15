class Server
  module App
    module Helpers

      def edit_directory( dir_path, dir_config )

        name = File.basename dir_path
        parent_data = load_dir_data parent_path_for( dir_path )
        dir_data = parent_data[ name ] || {}
        metadata_config = dir_config[:metadata] || {}

        dir = {
          view: :edit_dir,
          label: dir_data[:label] || name,
          type: dir_config[:type],
          metadata: dir_data[:metadata] || {},
          path: "#{ dir_path }/~dir",
          config: {
            metadata: metadata_config[:form],
          },
        }

        if dir_config[:name].is_a? Hash
          dir[:config][:name] = dir_config[:name]
          dir[:name] = dir_data[:label] || name
        elsif dir_config[:name].is_a? String
          dir[:config][:name] = false
        else
          dir[:config][:name] = {}
          dir[:name] = dir_data[:label] || name
        end

        dir

      end

    end
  end
end
