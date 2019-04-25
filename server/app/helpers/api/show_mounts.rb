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
            label: root_config[:label],
            # key: name,
            # id: id,
            description: description,
            # metadata: entry_metadata,
            # created: File.ctime( "#{ Server.fs_dir }/#{ name }" ),
            # updadte: File.mtime( "#{ Server.fs_dir }/#{ name }" )
          }
        end

        {
          name: '',
          key: '',
          label: config[:home][:label],
          description: config[:home][:description],
          type: :show_dir,
          collection: false,
          collect: { dirs: false, files: false },
          entries: entries,
          # config: mounts_config,
          # metadata: {},
          # created: nil,
          # updated: nil,
        }

      end

    end
  end
end
