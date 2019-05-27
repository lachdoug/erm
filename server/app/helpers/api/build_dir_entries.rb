class Server
  module App
    module Helpers

      def build_dirs_entries( dir, dir_config )

        touch_directory dir

        if dir_config[:dirs].is_a? Array
          dir_config[:dirs].each do |subdir_config|
            name = subdir_config[:name] || subdir_config[:label].downcase.gsub( ' ', '_' )
            dir_path = "#{ dir }/#{ name }"
            entry_path = dir_path
            touch_directory entry_path
            # apply_dir_permissions entry_path
            build_dirs_entries "#{ dir_path }/", subdir_config
          end
        end

        if dir_config[:files].is_a? Array
          dir_config[:files].each do |file_config|
            name = file_config[:name] || file_config[:label].downcase.gsub( ' ', '_' )
            file_path = "#{ dir }/#{ name }#{
              file_config[:ext] ? ".#{ file_config[:ext] }" : '' }"
            entry_path = file_path
            touch_file entry_path
            apply_file_permissions entry_path
          end
        end

      end

    end
  end
end
