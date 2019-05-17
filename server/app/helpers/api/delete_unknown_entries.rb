class Server
  module App
    module Helpers

      def delete_unknown_entries( dir_path, dir_config )

        dirname = File.basename dir_path

        entries = directory_entries dir_path, dir_config
        entries = entries.select do |entry|
          entry[:status] === :unknown
        end.each do |entry|
          entry_path = "#{ dir_path }/#{ entry[:name] }"
          remove_entry entry_path
        end

      end

    end
  end
end
