app.views.show_dir.metadata = ( r, data ) => (a,x) => {

  let component = []

  let as = data.metadata.as

  if ( as === "link" ) {

    let link = data.link || {}
    let href = link.href
    let label = link.label || "Open"

    component.push(
      a.hr,
      a.a(
        app.fa( "external-link", label ),
        { href: href, target: href, class: 'btn btn-link' }
      ),
      a.hr,
    )

  } else if ( as === "text" ) {

    component.push(
      a.hr,

      data.text.length ?
      data.text :
      a.i( "No content."),

      a.hr,
    )

  } else if ( as === "pre" ) {

    component.push(
      a.hr,

      data.text.length ?
      data.text :
      a.i( "No content."),

      a.hr,
    )

  } else if ( as === "list" ) {

    let object = data.metadata.object || {}

    component.push( x.appkit.list( object ) )

  } else if ( as === "markdown" ) {

    component.push(
      a.hr,

      data.text.length ?
      x.md( data.text ) :
      a.i( "No content."),

      a.hr,
    )

  } else if ( as === "code" ) {

    component.push(
      x.codemirror.code( data.text, { mode: data.mode } ),
    )

  } else {

    component.push( a.hr )
  }

  return a.p( component )

}
