class Server
  module App
    module Helpers

      def edit_raw_file( behavior, file_path, file_config )

        entry_path = file_path

        entry = file_entry behavior, file_path, file_config

        contents = read_file entry_path

        entry[:view] = :edit_raw_file
        entry[:contents] = contents

        entry[:mode] = mode_map( file_config[:mode] || file_config[:serialize] || file_config[:ext] || file_config[:as] )

        entry

      end

    end
  end
end
