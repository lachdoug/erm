class Server
  module App
    module Helpers

      def increment_index( dir_path )

        dir_data = load_dir_data dir_path
        index = dir_data[:index].to_i + 1
        dir_data[:index] = index
        save_dir_data dir_path, dir_data
        index

      end

    end
  end
end
