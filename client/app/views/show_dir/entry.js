app.views.show_dir.entry = function( r, entry ) {

  if ( entry.status === "present" ) {

    return (a,x) => a.p( [
      app.btn(
        app.fa(
          app.views.show_dir.entry.icon( entry ),
          entry.label
        ),
        () => r.open( `/${ entry.path }` )
      ),
      a.i( entry.description ),
    ] )

  } else {

    return (a,x) => a.p( [
      a[".bad-entry"](
        app.fa(
          app.views.show_dir.entry.icon( entry ),
          entry.label
        )
      ),
      a.i( entry.description ),
    ] )

  }

}
