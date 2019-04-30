app.views.show_dir.fixes = function( r, data ) {

  let unknown = data.entries.some( function( entry ) {
    return entry.status === "unknown"
  } )

  let missing = data.entries.some( function( entry ) {
    return entry.status === "missing"
  } )

  if ( unknown || missing ) {
    return (a,x) => a.p( [
      a.hr(),
      unknown ?
        app.btn(
          app.fa( "minus-square", "Remove unknown" ),
          () => r.open( `${ r.path }/unknown` ),
          "link float-right"
        ) : null,
      missing ?
        app.btn(
          app.fa( "plus-square", "Add missing" ),
          () => r.open( `${ r.path }/missing` ),
          "link"
        ) : null,
    ], { class: "clearfix" } )
  } else {
    return null
  }

}
