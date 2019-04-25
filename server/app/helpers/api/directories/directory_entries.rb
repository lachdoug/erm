class Server
  module App
    module Helpers

      def directory_entries( dir_path, dir_config )

        collect_dirs = dir_config[:dirs].is_a? Hash
        collect_files = dir_config[:files].is_a? Hash

        parent_data = load_dir_data( dir_path )

        list_options = {}
        if collect_files && dir_config[:files][:index]
          list_options[:index_files] = true
        end
        if collect_dirs && dir_config[:dirs][:index]
          list_options[:index_dirs] = true
        end

        entries = list_directory( "#{ Server.fs_dir }/#{ dir_path }", list_options ) do |entry|

          key = File.basename entry, '.*'
          name = File.basename entry
          path = entry.sub "#{ Server.fs_dir }/", ''
          entry_id = entry_id entry
          # created = File.ctime entry
          # updated = File.mtime entry
          dir_data = parent_data[ entry_id ] || {}

          if File.file? entry
            # debugger
            type = :file
            if collect_files
              description = dir_data[:description]
            else
              if dir_config[:files]
                subdir_config = dir_config[:files].detect do |file_config|
                  file_config[:key] === key
                end || {}
                description = subdir_config[:description]
              else
                description = ''
              end
            end
          else
            type = :dir
            if collect_dirs
              description = dir_data[:description]
            else
              if dir_config[:dirs]
                subdir_config = dir_config[:dirs].detect do |subdir_config|
                  subdir_config[:key] === key
                end || {}
                description = subdir_config[:description]
              else
                description = ''
              end
            end
          end

          order = dir_data[:order] || 0

          {
            path: URI.encode( "#{ path }/~#{ type }" ),
            type: type,
            name: name,
            key: key,
            entry_id: entry_id,
            index: dir_data[:index],
            description: description || '',
            order: order,
            # metadata: dir_data,
            # created: created,
            # updated: updated
          }

        end

        entries.sort_by do |entry|
          entry[:name].downcase
        end.sort_by do |entry|
          entry[:index]
        end.sort_by do |entry|
          entry[:order]
        end

      end

    end
  end
end
