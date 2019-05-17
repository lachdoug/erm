app.navbar.pills = (r) => (a,x) => {

  let location = r.path.replace( /^\/volumes/, '')
  // if ( location === '/~dir' ) location = '/'
  let path_match = location.match( /^((.*)\/~(dir|subdir|file))(.*)$/ )

  let base_path
  let entry_type
  let action
  let segments

  if ( path_match ) {
    base_path = path_match[2]
    entry_type = path_match[3]
    action = path_match[4]
    segments = base_path.split( '/' )
  } else {
    base_path = '/'
    entry_type = 'dir'
    action = ''
    segments = ['']
  }

  let scope = ''
  let pills = []
  let up_path

  let last_i = segments.length - 1
  let up_i = last_i - ( action ? 0 : 1 )

  segments.forEach( ( segment, i) => {

    let path = `${ scope }${ segment }`
    let component

    // debugger
    if ( i === 0 && i === last_i ) {
// component = app.btn( app.fa( 'home' ), ()=> r.open( `/volumes/~dir` ) )
  component = a['.pill-selected']( app.fa( "home" ) )
      // if ( base_path === location ) {
      // } else {
      // }
    } else if ( i === 0 ) {
      component = app.btn( app.fa( 'home' ), ()=> r.open( `/volumes/~dir` ) )
    } else if ( i === last_i ) {
      let fa = entry_type === "dir" ? "folder" : "file-o"
      if ( action ) {
        component = app.btn(
          app.fa( fa, decodeURIComponent( segment ) ),
          ()=> r.open( `/volumes${ path }/~${ entry_type }` )
        )
        up_path = `/volumes${ path }/~${ entry_type }`
      } else {
        component = a['.pill-selected']( app.fa(
          fa, decodeURIComponent( segment )
        ) )
        up_path = `/volumes${ scope }~dir`
      }
    } else {
      component = app.btn(
        app.fa( 'folder', decodeURIComponent( segment ) ),
        ()=> r.open( `/volumes${ path }/~dir` )
      )
    }

    pills.push( component )

    scope = `${ path }/`

  } )

  let component = [
    ( pills.length > 1 ) ? app.btn(
      app.fa( 'arrow-up' ),
      ()=> r.open( up_path ),
      "link float-right"
    ) : null,
    pills,
  ]

  return a["p.pills"]( component )

}
