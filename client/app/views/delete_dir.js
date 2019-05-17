app.views.delete_dir = ( r, data ) => (a,x) => [
  a.h3( `Delete ${ data.label }` ),
  a.p( [
    "Are you sure that you want to delete the directory ",
    a.strong( data.dirname ), " and all its contents?"
  ] ),
  x.appkit.form( (f) => [
    f.button( {
      icon: "fa fa-times",
      text: "Cancel",
      buttonTag: { class: "btn btn-secondary" },
      onclick: (e, el, form) => r.open( `/${ data.path }` ),
    } ),
    " ",
    f.submit( {
      icon: "fa fa-check",
      text: `Delete ${ data.type }`,
      buttonTag: { class: "btn btn-primary" },
    } ),
  ], {
    method: 'DELETE',
    action: `/api/${ data.path }`,
    success: function( data, el ) {
      r.open( `/${ data.path }` )
    }
  } )
]
