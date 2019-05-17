class Server
  module App
    module Helpers

      def show_mounts( mounts_config )

        entries = mounts_config.map do |root_config|

          name = root_config[:name] || root_config[:label].downcase.gsub( ' ', '_' )

          description = root_config[:description]

          {
            path: "volumes/#{ name }/~dir",
            entry_type: :dir,
            status: :present,
            label: root_config[:label] || name,
            description: description,
          }
        end

        home_config = config[:home] || {}

        {
          label: home_config[:label] || "Home",
          description: home_config[:description],
          view: :show_dir,
          collection: false,
          collect: { dirs: false, files: false },
          entries: entries,
        }

      end

    end
  end
end
