app.views.show_file.as = ( r, data ) => (a,x) => {

  let component = []

  if ( data.as === "link" ) {

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

  } else if ( data.as === "text" ) {

    component.push(
      a.hr,

      data.text.length ?
      data.text :
      a.i( "No content."),

      a.hr,
    )

  } else if ( data.as === "pre" ) {

    component.push(
      a.hr,

      data.text.length ?
      data.text :
      a.i( "No content."),

      a.hr,
    )

  } else if ( data.as === "list" ) {

    component.push(
      a.hr,

      Object.keys( data.object ).length ?
      x.appkit.list( data.object ) :
      a.i( "No content."),

      a.hr,
    )

  } else if ( data.as === "markdown" ) {

    component.push(
      a.hr,

      data.text.length ?
      x.md( data.text ) :
      a.i( "No content."),

      a.hr,
    )

  } else if ( data.as === "code" ) {

    component.push(
      x.codemirror.code( data.text, { mode: data.mode } ),
    )

  } else {

    component.push( a.hr )
  }

  return a.p( component )

}
