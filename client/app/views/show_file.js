app.views.show_file = ( r, data ) => (a,x) => [

  a.h3( [
    data.label,
    ' ',
    a.small( a.i( data.description ) ),
  ] ),

  a.p( [

    data.item && data.item.edit ? app.btn(
      app.fa( "tag", data.type ),
      () => r.open( `${ r.path }/edit` )
    ) : null,

    data.raw ? app.btn(
      app.fa( "file-text-o", `Raw` ),
      () => r.open( `${ r.path }/raw` )
    ) : null,

    data.editor ? app.btn(
      app.fa( "code", `Editor` ),
      () => r.open( `${ r.path }/raw/edit` )
    ) : null,

    data.download ? a.a(
      app.fa( "download", `Download` ),
      {
        href: `/download${ r.path.replace( /\/~.*/, '' ) }`,
        class: "btn btn-link"
      }
    ) : null,

    data.item && data.item.delete ? app.btn(
      app.fa( "trash", `Delete ${ data.type }` ),
      () => r.open( `${ r.path }/delete` ),
      "link float-right",
    ) : null,

  ], { class: "clearfix" } ),

  data.error ? [
    a.hr,
    a.p( data.error, { class: "error" } ),
    a.hr,
  ] : app.views.show_file.as( r, data ),

  a["p.text-center"]( a.small( [
    data.item && data.item.new ? data.created ?
      [
        "Created",
        x.timeago( data.created )
      ] :
      [ "Creation date unknown" ] : null,
    [ "Modified", x.timeago( data.modified ) ],
  ] ) ),

]
