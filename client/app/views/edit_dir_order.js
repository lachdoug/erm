app.views.edit_dir_order = ( r, data ) => (a,x) => {

  return [
    a.h3( `Order ${ data.label }` ),
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
              f.input( { name: "dir[order][]", value: entry.name, type: "hidden" } ),
              a["p.order-dir-item"]( [
                app.fa( entry.entry_type === "file" ? "file-o" : "folder", entry.label ),
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
