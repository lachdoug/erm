// app.views.missing_dir_entries = ( r, data ) => (a,x) => {
//
//   let entries = data.entries
//
//   return [
//     a.h4( data.dirname ),
//     "Create missing entries?",
//     a.ul(
//       entries.map( function( entry ) {
//         return a.li( entry )
//       } )
//     ),
//     x.appkit.form( (f) => [
//       f.button( {
//         icon: "fa fa-times",
//         text: "Cancel",
//         buttonTag: { class: "btn btn-secondary" },
//         onclick: (e, el, form) => r.open( `/${ data.path }` ),
//       } ),
//       " ",
//       f.submit( {
//         icon: "fa fa-check",
//         text: `Create entries`,
//         buttonTag: { class: "btn btn-primary" },
//       } ),
//       // x.appkit.put( data ),
//     ], {
//       data: data,
//       action: `/api/${ data.path }/missing`,
//       success: function( data, el ) {
//         r.open( `/${ data.path }` )
//       },
//     } )
//   ]
//
//
// }
