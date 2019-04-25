app.views.edit_dir_order = ( r, data ) => (a,x) => {

  return [
    a.h4( `Order ${ data.name }` ),
    a.p( [
      app.btn(
        app.fa( "check", `Done` ),
        () => r.open( `/${ data.path }` )
      ),
    ] ),
    a.hr,
    a[".order-dir"](
      x.appkit.form( (f) => [
        f.many( "sort", (ff) => ff.items( [
          (ffi) => x.html5sortable(
            data.entries.map( ( entry, i ) => a.li( [
              f.input( { name: "dir[order][]", value: entry.entry_id, type: "hidden" } ),
              a["p.order-dir-item"]( [
                app.fa( entry.type === "file" ? "file-o" : "folder", entry.name ),
                a.i( entry.description ),
              ] )
            ] ) ),
            {
              type: "ul",
              sortupdate: function( e, el ) { el.$("^form").$submit() }
            }
          )
        ] ) )
      ], {
        onsubmit: ( e, form ) => {
          x.appkit.http( `/api/${ data.path }/order`, {
            body: form.$serialize(),
            method: "POST",
            success: () => {},
          } )
        },
      } )
    ),
  ]

}
