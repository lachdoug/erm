app.views.show_dir = ( r, data ) => (a,x) => [

  a.h4( [
    data.dirname || data.label || "Home",
    ' ',
    a.small( a.i( data.description ) ),
  ] ),

  a.p( [

    data.item && data.item.edit ?
    app.btn(
      app.fa( "tag", data.label ),
      () => r.open( `${ r.path }/edit` )
    ) : null,

    data.order ?
      app.btn(
        app.fa( "sort", `Order ${ data.label }` ),
        () => r.open( `${ r.path }/order/edit` )
      ) : null,

    data.collect.dirs && data.collect.dirs.new ?
      app.btn(
        app.fa( "plus-square", `New ${ data.collect.dirs.key }` ),
        () => r.open( `${ r.path }/subdir/new` )
      ) : null,

    data.collect.files && data.collect.files.new ?
      app.btn(
        app.fa( "plus-square-o", `New ${ data.collect.files.key }` ),
        () => r.open( `${ r.path }/file/new` )
      ) : null,

    data.item && data.item.delete ?
      app.btn(
        app.fa( "trash", `Delete ${ data.label }` ),
        () => r.open( `${ r.path }/delete` ),
        "link float-right"
      ) : null,

  ], { class: "clearfix" } ),

  app.views.show_dir.fixes( r, data ),

  data.metadata ? app.views.show_dir.metadata( r, data ) : null,

  a.hr,

  data.entries.length ?
  data.entries.map( ( entry, i ) =>
    app.views.show_dir.entry( r, entry )
  ) : a.i("No entries"),

  // x.appkit.put( data ),
  // x.appkit.put( r ),

  data.created ? [
    a.hr,
    a["p.text-center"]( a.small( [
      a.label( "Created" ), ' ', x.timeago( data.created ),
    ] ) ),
  ] : null,

]
