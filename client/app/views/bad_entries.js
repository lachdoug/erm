app.views.bad_entries = ( r, data ) => (a,x) => {

  let entries = data.entries

  let message = data.problem === "missing" ? "Add missing entries?" : "Remove unknown entries?"
  let submitText = data.problem === "missing" ? "Create entries?" : "Delete entries?"

  return [
    a.h3( data.dirname ),
    message,
    a.ul(
      entries.map( function( entry ) {
        return a.li( entry )
      } )
    ),
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
        text: submitText,
        buttonTag: { class: "btn btn-primary" },
      } ),
    ], {
      data: data,
      action: `/api/${ data.path }/${ data.problem }`,
      success: function( data, el ) {
        r.open( `/${ data.path }` )
      },
    } )
  ]


}
