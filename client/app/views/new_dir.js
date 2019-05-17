app.views.new_dir = ( r, data ) => (a,x) => {

  let metadata = data.config.metadata || []

  return [
    a.h3( `New ${ data.type }` ),
    x.appkit.form( (f) => [
      data.config.name ? f.fields( {
        key: "name",
        required: true,
        input: { class: "form-control" },
        ...data.config.name
      } ) : null,
      metadata.length ?
        [
          f.one( "metadata", (ff) => ff.fields( metadata.map(
            ( component ) => {
              if ( component.field ) {
                let field = component.field
                return {
                  ...field,
                  input: { class: "form-control", ...field.input },
                  select: { class: "form-control", ...field.select },
                  textarea: { class: "form-control", ...field.textarea },
                }
              } else {
                return component.tag
              }
            }
          ) ) )
        ]
        : null,
      f.button( {
        icon: "fa fa-times",
        text: "Cancel",
        buttonTag: { class: "btn btn-secondary" },
        onclick: (e, el, form) => r.open( `/${ data.path }` ),
      } ),
      " ",
      f.submit( {
        icon: "fa fa-check",
        text: `Create ${ data.type }`,
        buttonTag: { class: "btn btn-primary" },
      } ),
    ], {
      action: `/api/${ data.path }/subdir`,
      scope: "dir",
      success: function( data, el ) {
        r.open( `/${ data.path }` )
      },
    } ),

  ]

}
