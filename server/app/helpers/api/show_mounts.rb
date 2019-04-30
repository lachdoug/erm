class Server
  module App
    module Helpers

      def show_mounts( mounts_config )

        # metadata = load_metadata( '' )

        entries = mounts_config.map do |root_config|

          name = root_config[:name] || root_config[:key]

          description = root_config[:description]

          {
            path: "#{ name }/~dir",
            name: name,
            type: :dir,
            status: :present,
            label: root_config[:label],
            description: description,
          }
        end

        home_config = config[:home] || {}

        {
          name: '',
          label: home_config[:label],
          description: home_config[:description],
          type: :show_dir,
          collection: false,
          collect: { dirs: false, files: false },
          entries: entries,
        }

      end

    end
  end
end
