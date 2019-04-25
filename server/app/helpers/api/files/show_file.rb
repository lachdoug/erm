class Server
  module App
    module Helpers

      def show_file( behavior, file_path, file_config )

        file = file_entry behavior, file_path, file_config

        file[:type] = :show_file

        file[:mode] = mode_map( file_config[:mode] || file_config[:serialize] || file_config[:ext] || file_config[:as] )

        as = as_map( file_config[:as] || file_config[:serialize] || file_config[:ext] )
        if as

          file[:as] = as

          case as.to_sym
          when :link
            link_config = file_config[:link] || {}

            created = Time.at( file[:created] / 1000 )

            template_params = {
              name: File.basename( file[:filename] ),
              filename: file[:filename],
              ext: file[:ext],
              path: URI.encode( file_path ),
              fs_path: URI.encode( file_path.sub( /^[^\/]+\//, '' ) ),
              inode: file[:file_id],
              index: file[:index],
              created: created.strftime("%F %T"),
              keys: params.tap { |result| result.delete :file }.to_h,
              metadata: file[:metadata] || {}
            }
            href = URI.encode( process_template link_config[:href], template_params )
            file[:link] = {
              label: link_config[:label],
              href: href
            }
          when :text, :markdown, :code
            entry_path = "#{ Server.fs_dir }/#{ file_path }"
            file[:text] = read_file entry_path
          when :list
            serialize =
              file_config[:serialize] ||
              ( file_config[:ext] === "yaml" || file_config[:ext] === "yaml" ) ?
                :yaml : :json
            entry_path = "#{ Server.fs_dir }/#{ file_path }"
            file_contents = read_file entry_path
            case serialize.to_sym
            when :yaml
              # debugger
              if file_contents.empty?
                file[:object] = {}
              else
                begin
                  file[:object] = YAML.load( file_contents )
                rescue
                  file[:error] = "Bad YAML."
                end
              end
            when :json
              # debugger
              if file_contents.empty?
                file[:object] = {}
              else
                begin
                  file[:object] = JSON.parse( file_contents )
                rescue
                  file[:error] = "Bad JSON."
                end
              end
            end
          end

        end

        file

      rescue Errno::ENOENT

        name = file_path.match( /([^\/]+)$/ )
        raise ApiError.new( "#{ name } does not exist.", 404 )

      end

    end
  end
end
