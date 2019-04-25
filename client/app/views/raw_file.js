app.views.raw_file = ( r, data ) => (a,x) => [

  a.h4( [
    data.filename,
    ' ',
    a.small( a.i( data.description ) ),
  ] ),

  a.p( [

    app.btn(
      app.fa( "check", `Done` ),
      () => r.open( `/${ data.path }` )
    ),

    app.btn(
      app.fa( "code", `Editor` ),
      () => r.open( `/${ data.path }/raw/edit` )
    ),

  ] ),
  a.hr,

  a.pre( data.content ),

]
