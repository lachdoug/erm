class Server
  module App
    module Helpers

      def directory_entries( dir_path, dir_config )

        collect_dirs = dir_config[:dirs].is_a? Hash
        collect_files = dir_config[:files].is_a? Hash

        parent_data = load_dir_data( dir_path ) || {}

        list_options = {}
        if collect_files && dir_config[:files][:index]
          list_options[:index_files] = true
        end
        if collect_dirs && dir_config[:dirs][:index]
          list_options[:index_dirs] = true
        end

        entries = list_directory( "#{ Server.fs_dir }/#{ dir_path }", list_options ) do |entry|

          entry_name = File.basename entry
          path = entry.sub "#{ Server.fs_dir }/", ''
          dir_data = parent_data[ entry_name ] || {}

          status = :present

          if File.file? entry
            type = :file
            path = "#{ path }/~file"
            if collect_files
              description = dir_data[:description]
            else
              file_config = dir_config[:files].detect do |file_config|
                filename = file_config[:name] + ( file_config[:ext] ? ".#{ file_config[:ext] }" : '' )
                filename === entry_name
              end
              if file_config
                description = file_config[:description]
              else
                path = "#{ dir_path }/~dir/unknown"
                status = :unknown
                file_config = {}
                description = 'Unknown file'
              end
            end
          else
            type = :dir
            path = "#{ path }/~dir"
            if collect_dirs
              description = dir_data[:description]
            else
              subdir_config = dir_config[:dirs].detect do |subdir_config|
                subdir_config[:name] === entry_name
              end
              if subdir_config
                description = subdir_config[:description]
              else
                path = "#{ dir_path }/~dir/unknown"
                status = :unknown
                subdir_config = {}
                description = 'Unknown directory'
              end
            end
          end

          order = dir_data[:order] || 0

          {
            path: path,
            name: entry_name,
            type: type,
            status: status,
            index: dir_data[:index],
            description: description || '',
            order: order,
          }

        end


        unless collect_dirs

          dir_names = entries.select{ |entry| entry[:type] === :dir }.map { |dir| dir[:name] }
          configured_dir_names = ( dir_config[:dirs] || [] ).map{ |dir| dir[:name] }

          missing_dir_names = configured_dir_names - dir_names

          missing_dir_names.each do |dir_name|

            entries.unshift( {
              path: "#{ dir_path }/~dir/missing",
              type: :dir,
              status: :missing,
              name: dir_name,
              index: nil,
              description: "Missing directory",
              order: 0
            } )

          end

        end

        unless collect_files

          file_names = entries.select{ |entry| entry[:type] === :file }.map { |file| file[:name] }
          configured_file_names = ( dir_config[:files] || [] ).map do |file_config|
            file_config[:name] + ( file_config[:ext] ? ".#{ file_config[:ext] }" : '' )
          end

          missing_file_names = configured_file_names - file_names

          missing_file_names.each do |file_name|

            entries.unshift( {
              path: "#{ dir_path }/~dir/missing",
              type: :file,
              status: :missing,
              name: file_name,
              index: nil,
              description: "Missing file",
              order: 0
            } )

          end

        end

        entries.sort_by do |entry|
          entry[:name].downcase
        end.sort_by do |entry|
          entry[:index]
        end.sort_by do |entry|
          case entry[:status]
          when :unknown; 1
          when :missing; 2
          when :present; 3
          end
        end.sort_by do |entry|
          entry[:order]
        end

      end

    end
  end
end
