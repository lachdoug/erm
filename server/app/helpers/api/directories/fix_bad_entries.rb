class Server
  module App
    module Helpers

      def fix_bad_entries( problem, dir_path, dir_config )

        if problem === :missing
          build_dirs_entries( dir_path, dir_config )
        elsif problem === :unknown
          delete_unknown_entries( dir_path, dir_config )
        end

        {
          type: :fix_bad_entries,
          problem: problem,
          path: "#{ dir_path }/~dir",
        }

      end

    end
  end
end
