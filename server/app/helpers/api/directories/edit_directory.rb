class Server
  module App
    module Helpers

      def edit_directory( dir_path, dir_config )

        name = dir_path.split('/').last
        parent_data = load_dir_data parent_path_for( dir_path )
        dir_id = entry_id "#{ Server.fs_dir }/#{ dir_path }"
        dir_data = parent_data[ dir_id ] || {}
# debugger
        metadata_config = dir_config[:metadata] || {}


        dir = {
          type: :edit_dir,
          dirname: name,
          label: dir_config[:label] || dir_config[:key],
          metadata: dir_data[:metadata] || {},
          path: URI.encode( "#{ dir_path }/~dir" ),
          config: {
            metadata: metadata_config[:form],
            # label: dir_config[:label] || dir_config[:key],
            # index: dir_config[:index],
            # description: dir_config[:description],
          },
        }

        if dir_config[:name].is_a? Hash
          dir[:config][:name] = dir_config[:name]
          dir[:name] = dir_data[:name]
        elsif dir_config[:name].is_a? String
          dir[:config][:name] = false
        else
          dir[:config][:name] = {}
          dir[:name] = dir_data[:name]
        end

        dir

      end

    end
  end
end
