class Server
  module App
    module Helpers

      def bad_entries( problem, dir_path, dir_config )

        dirname = File.basename dir_path

        entries = directory_entries dir_path, dir_config
        entries = entries.select do |entry|
          entry[:status] === problem
        end.map do |entry|
          entry[:name]
        end

        {
          type: :bad_entries,
          path: "#{ dir_path }/~dir",
          dirname: dirname,
          entries: entries,
          problem: problem,
        }

      end

    end
  end
end
