app.views.show_file = ( r, data ) => (a,x) => [

  a.h4( [
    data.filename,
    ' ',
    a.small( a.i( data.description ) ),
  ] ),

  a.p( [

    data.item && data.item.edit ? app.btn(
      app.fa( "tag", data.label ),
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

    data.item && data.item.delete ? app.btn(
      app.fa( "trash", `Delete ${ data.label }` ),
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
    a.label( "Created" ), ' ', x.timeago( data.created ),
    a.br,
    a.label( "Modified" ), ' ', x.timeago( data.modified ),
  ] ) ),

  // x.appkit.put( data ),

]
