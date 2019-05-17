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

        entries = list_directory( dir_path, list_options ) do |entry|

          entry_name = File.basename entry
          # path = entry.sub "#{ Server.fs_dir }/", ''
          path = entry
          dir_data = parent_data[ entry_name ] || {}

          status = :present

          if File.file? entry
            entry_type = :file
            path = "#{ path }/~file"
            if collect_files
              label = dir_data[:label] || entry_name.split('.')[0]
              description = dir_data[:description]
            else
              file_config = ( dir_config[:files] || [] ).detect do |file_config|
                name = file_config[:name] || file_config[:label].downcase.gsub( ' ', '_' )
                filename = name + ( file_config[:ext] ? ".#{ file_config[:ext] }" : '' )
                filename === entry_name
              end
              if file_config
                label = file_config[:label] || file_config[:name]
                description = file_config[:description]
              else
                path = "#{ dir_path }/~dir/unknown"
                label = entry_name
                status = :unknown
                file_config = {}
                description = 'Unknown file'
              end
            end
          else
            entry_type = :dir
            path = "#{ path }/~dir"
            if collect_dirs
              label = dir_data[:label] || entry_name
              description = dir_data[:description]
            else
              subdir_config = ( dir_config[:dirs] || [] ).detect do |subdir_config|
                dirname = subdir_config[:name] || subdir_config[:label].downcase.gsub( ' ', '_' )
                dirname === entry_name
              end
              if subdir_config
                label = subdir_config[:label] || subdir_config[:name]
                description = subdir_config[:description]
              else
                path = "#{ dir_path }/~dir/unknown"
                label = entry_name
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
            label: label,
            entry_type: entry_type,
            status: status,
            index: dir_data[:index],
            description: description || '',
            order: order,
          }

        end


        unless collect_dirs

          dir_names = entries.select{ |entry| entry[:entry_type] === :dir }.map { |dir| dir[:name] }
          static_dir_names = ( dir_config[:dirs] || [] ).map{ |dir| dir[:name] || dir[:label].downcase.gsub( ' ', '_' ) }

          missing_dir_names = static_dir_names - dir_names

          # debugger

          missing_dir_names.each do |dir_name|

            subdir_config = dir_config[:dirs].find do |dir|
              name = dir[:name] || dir[:label].downcase.gsub( ' ', '_' )
              name === dir_name
            end

            entries.unshift( {
              path: "#{ dir_path }/~dir/missing",
              entry_type: :dir,
              status: :missing,
              name: dir_name,
              label: subdir_config[:label] || dir_name,
              index: nil,
              description: "Missing directory",
              order: 0
            } )

          end

          entries = entries.map do |entry|
            if entry[:entry_type] === :dir
              presence = case entry[:status]
              when :unknown; 1
              when :missing; 2
              when :present; 3
              end
              index = static_dir_names.index( entry[:name] )
              [ 0, presence, index, entry ]
            else
              [ 1, 0 , 0, entry ]
            end
          end.sort_by do |entry|
            [ entry[0], entry[1], entry[2] ]
          end.map do |entry|
            entry[3]
          end

        end

        unless collect_files

          file_names = entries.select{ |entry| entry[:entry_type] === :file }.map { |file| file[:name] || file[:label].downcase.gsub( ' ', '_' ) }
          static_file_names = ( dir_config[:files] || [] ).map do |file_config|
            name = file_config[:name] || file_config[:label].downcase.gsub( ' ', '_' )
            name + ( file_config[:ext] ? ".#{ file_config[:ext] }" : '' )
          end

          missing_file_names = static_file_names - file_names

          missing_file_names.each do |file_name|

            file_config = dir_config[:files].find do |file_config|
              name = file_config[:name] || file_config[:label].downcase.gsub( ' ', '_' )
              name === file_name
            end

            entries.unshift( {
              path: "#{ dir_path }/~dir/missing",
              entry_type: :file,
              status: :missing,
              name: file_name,
              label: file_config[:label] || file_name,
              index: nil,
              description: "Missing file",
              order: 0
            } )

          end

          entries = entries.map do |entry|
            if entry[:entry_type] === :file
              presence = case entry[:status]
              when :unknown; 1
              when :missing; 2
              when :present; 3
              end
              index = static_file_names.index( entry[:name] )
              [ 1, presence, index, entry ]
            else
              [ 0, 0, 0, entry ]
            end
          end.sort_by do |entry|
            [ entry[0], entry[1], entry[2] ]
          end.map do |entry|
            entry[3]
          end

        end

        entries.sort_by do |entry|
          entry[:order]
        end

      end

    end
  end
end
