app.views.edit_raw_file = ( r, data ) => (a,x) => [

  a.h3( [
    data.label,
    ' ',
    a.small( a.i( data.description ) ),
  ] ),

  x.appkit.form( (f) => [
    f.fields( { key: "contents", as: "code", label: false, code: { mode: data.mode || '' } } ),
    f.button( {
      icon: "fa fa-times",
      text: "Cancel",
      buttonTag: { class: "btn btn-secondary" },
      onclick: (e, el, form) => r.open( `/${ data.path }` ),
    } ),
    " ",
    f.submit( {
      icon: "fa fa-check",
      text: `Update ${ data.type }`,
      buttonTag: { class: "btn btn-primary" },
    } ),
  ], {
    data: data,
    action: `/api/${ data.path }/raw`,
    scope: "file",
    success: function( data, el ) {
      r.open( `/${ data.path }` )
    },
  } ),

]
