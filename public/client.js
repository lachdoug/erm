'use strict'
let app = function(a,x) { return [
  app.css,
  x.appkit.router( (r) => [
    app.navbar(r),
    a["div.container"](
      r.routes( {
        '/sign_in': app.views.sign_in,
        '/volumes/**': app.views
      }, {
        transition: x.appkit.transition.fade(
          x.appkit.loading, { time: 200 } ),
      } )
    )

  ], {
    default: (r) => (a,x) => [
      a.p( `Not found ${ r.path }` ),
    ],
  } ),
] }

app.navbar = (r) => (a,x) => [
  a.h5( [
    a.img( {
      src: `/${ ( config.logo || {} ).src || 'logo.png' }`,
      height: ( config.logo || {} ).height || '',
      width: ( config.logo || {} ).width || '',
    } ),
    config.title || 'ERM'
  ] ),
  a["div.container.clearfix"]( r.routes( {
    '%%': app.navbar.pills
  } ) ),
  a.hr,

]

app.views = (r) => (a,x) => x.appkit.http(
  `/api${ r.path }`,
  {
    resolver: app.views.resolver(r),
  }
)

app.fa = function( icon, text ) {
  return (a,x) => x.appkit.icon( `fa fa-${ icon }`, text )
}

app.css = (a,x) => x.appkit.document.css( [

  {
    ".error": {
      color: "red",
    },
    ".pills": {
      padding: "0 0.375rem",
      ".btn": {
        padding: "0 0.375rem"
      },
      ".pill-selected": {
        border: "1px solid transparent",
        verticalAlign: "middle",
        padding: "0 0.375rem",
        color: "grey",
        lineHeight: "1.5",
        display: "inline-block",
      }
    },
    ".order-dir": {
      ul: {
        listStyleType: "none",
        padding: 0,
      },
      ".order-dir-item": {
        padding: ".375rem 0",
        border: "1px solid transparent",
        cursor: "grab",
        "appkit-icon" : {
          padding: "0 0.75rem",
        }
      }
    },
    ".bad-entry": {
      padding: ".375rem .75rem",
      lineHeight: 1.5,
      display: "inline-block",
      color: "red"
    },
    "appkit-list": {
      fontFamily: "monospace",
      whiteSpace: "pre",
      color: "lightgrey",
      "appkit-list-type-null": {
        color: "red"
      },
      "appkit-list-type-number": {
        color: "green"
      },
      "appkit-list-type-text": {
        color: "blue",
        maxHeight: "300px",
        display: "inline-block",
      },
      "ul, ol": {
        padding: "0 0 0 20px",
      },
      label: {
        fontWeight: "bold",
        color: "grey",
        margin: "0px",
        verticalAlign: "top",
      }
    },
    ".CodeMirror-scroll": {
      maxHeight: "80vh",
    },
    ".fullscreen .CodeMirror-scroll": {
      maxHeight: "unset",
    },
    ".file-open-iframe": {
      width: "100%",
      height: "80vh",
      border: "none",
    }
  },
  config.css || {}
] )

app.btn = function( component, onclick, klass='link', options={} ) {

  return (a,x) => x.appkit.button( component, onclick, {
    buttonTag: {
      disabled: options.disabled,
      class: `btn btn-${ klass }`,
      ...options.buttonTag
    }
  } )
}

app.views.edit_file = ( r, data ) => (a,x) => {

  let metadata = data.config.metadata || []

  return [
    a.h3( `Edit ${ data.label }` ),
    x.appkit.form( (f) => [
      data.config.name ? f.fields( {
        key: "name",
        required: true,
        input: { class: "form-control" },
        ...data.config.name,
      } ) : null,
      metadata.length ?
      f.one( "metadata", (ff) => ff.fields( metadata.map(
        ( component ) => {
          if ( component.field ) {
            let field = component.field
            return {
              ...field,
              input: { class: "form-control", ...field.input },
              select: { class: "form-control", ...field.select },
              textarea: { class: "form-control", ...field.textarea },
              // input: { class: "form-control" },
            }

          } else {

            return component.tag

          }
        }
      ) ) ) : null,      f.button( {
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
      ,
    ], {
      data: data,
      action: `/api/${ data.path }`,
      scope: "file",
      success: function( data, el ) {
        r.open( `/${ data.path }` )
      },
    } )
  ]

}

app.views.edit_dir = ( r, data ) => (a,x) => {

  let metadata = data.config.metadata || []

  return [
    a.h3( `Edit ${ data.label }` ),
    x.appkit.form( (f) => [
      data.config.name ? f.fields( {
        key: "name",
        required: true,
        input: { class: "form-control" },
        ...data.config.name
      } ) : null,
      metadata.length ?
      f.one( "metadata", (ff) => ff.fields( metadata.map(
        ( component ) => {
          if ( component.field ) {
            let field = component.field
            return {
              ...field,
              input: { class: "form-control", ...field.input },
              select: { class: "form-control", ...field.select },
              textarea: { class: "form-control", ...field.textarea },
              // input: { class: "form-control" },
            }

          } else {

            return component.tag

          }
        }
      ) ) ) : null,
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
      ,
    ], {
      data: data,
      action: `/api/${ data.path }`,
      scope: "dir",
      success: function( data, el ) {
        r.open( `/${ data.path }` )
      },
    } )
  ]


}

app.views.renderer = ( r, data ) => (a,x) => {

  return a["app-view"]( [
    // app.views.error( r, data ),
    app.views.sign_out(r),
    app.views[ data.view ]( r, data )
  ] )

}

app.views.sign_out = (r) => (a,x) => a["app-sign-out"](
  app.btn(
    app.fa( "sign-out", "Sign out" ),
    ( e, el ) => el.$('^').$nodes( x.appkit.http(
      `/api/session`,
      {
        method: "DELETE",
        success: () => {
          app.views.sign_in.redirect = r.path
          r.open( "/sign_in" )
        },
      }
    ) ),
  ),
  { class: "pull-right" }
)

app.views.resolver = (r) => ( request ) => ( el, dataPromise ) => [
  dataPromise.then( ( data ) => {
    el.$nodes = () => app.views.renderer( r, data )
  } ).catch( ( err, aaa, bbb ) => {
    ax.log( err )
    el.$nodes = [
      (a,x) => x.appkit.put( err.message ),
      request.status === 401 ? app.btn(
        app.fa( "sign-in", "Sign in" ),
        () => r.open( `/sign_in` )
      ) : null
    ]
  } )
]

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

app.views.new_file = ( r, data ) => (a,x) => {

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
                // input: { class: "form-control" },
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
        onclick: (e, el, form) => r.open( `/${ data.path.replace( '/~file', '/~dir') }` ),
      } ),
      " ",
      f.submit( {
        icon: "fa fa-check",
        text: `Create ${ data.type }`,
        buttonTag: { class: "btn btn-primary" },
      } ),

    ], {
      action: `/api/${ data.path }/file`,
      scope: "file",
      success: function( data, el ) {
        r.open( `/${ data.path }` )
      },
    } )
  ]

}

// app.views.error = function( r, data ) {
//
//   return (a,x) => a["app-view-error"]( {
//     $show: function( err, request ) {
//       debugger
//       this.$nodes( a.p( err, { class: "alert alert-warning" } ) )
//     }
//   } )
//
// }

app.views.delete_file = ( r, data ) => (a,x) => [
  a.h3( `Delete ${ data.label }` ),
  a.p( [
    "Are you sure that you want to delete the file",
    a.strong( data.filename ), "?"
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

app.views.edit_dir_order = ( r, data ) => (a,x) => {

  return [
    a.h3( `Order ${ data.label }` ),
    a.p( [
      app.btn(
        app.fa( "check", `Done` ),
        () => r.open( `/${ data.path }` )
      ),
    ] ),
    a.hr,
    a[".order-dir"](
      x.appkit.form( (f) => [
        f.many( "sort", (ff) => ff.items( [
          (ffi) => x.html5sortable(
            data.entries.map( ( entry, i ) => a.li( [
              f.input( { name: "dir[order][]", value: entry.name, type: "hidden" } ),
              a["p.order-dir-item"]( [
                app.fa( entry.entry_type === "file" ? "file-o" : "folder", entry.label ),
                a.i( entry.description ),
              ] )
            ] ) ),
            {
              type: "ul",
              sortupdate: function( e, el ) { el.$("^form").$submit() }
            }
          )
        ] ) )
      ], {
        onsubmit: ( e, form ) => {
          x.appkit.http( `/api/${ data.path }/order`, {
            body: form.$serialize(),
            method: "POST",
            success: () => {},
          } )
        },
      } )
    ),
  ]

}

app.views.sign_in = (r) => (a,x) => a["app-sign-in"]( [

  a.h3( "Authentication" ),

  x.appkit.form( (f) => [
    f.fields( {
      key: "token",
      type: "password",
      label: false,
      placeholder: "Token",
      input: {
        class: "form-control",
      },
      confirm: false,
    } ),
    f.submit( {
      icon: "fa fa-sign-in",
      text: `Sign in`,
      buttonTag: { class: "btn btn-primary" },
    } ),
  ], {
    action: `/api/session`,
    success: function( data, el ) {
      r.open( app.views.sign_in.redirect )
      return true
    },
  } ),

] )

app.views.show_dir = ( r, data ) => (a,x) => [

  a.h3( [
    data.label,
    ' ',
    a.small( a.i( data.description ) ),
  ] ),

  a.p( [

    data.item && data.item.edit ?
    app.btn(
      app.fa( "tag", data.type ),
      () => r.open( `${ r.path }/edit` )
    ) : null,

    data.order ?
      app.btn(
        app.fa( "sort", `Order ${ data.label }` ),
        () => r.open( `${ r.path }/order/edit` )
      ) : null,

    data.collect.dirs && data.collect.dirs.new ?
      app.btn(
        app.fa( "plus-square", `New ${ data.collect.dirs.type }` ),
        () => r.open( `${ r.path }/subdir/new` )
      ) : null,

    data.collect.files && data.collect.files.new ?
      app.btn(
        app.fa( "plus-square-o", `New ${ data.collect.files.type }` ),
        () => r.open( `${ r.path }/file/new` )
      ) : null,

    data.item && data.item.delete ?
      app.btn(
        app.fa( "trash", `Delete ${ data.type }` ),
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

  data.created ? [
    a.hr,
    a["p.text-center"]( a.small( [
      a.label( "Created" ), ' ', x.timeago( data.created ),
    ] ) ),
  ] : null,

]

app.views.raw_file = ( r, data ) => (a,x) => [

  a.h3( [
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

app.views.show_file = ( r, data ) => (a,x) => [

  a.h3( [
    data.label,
    ' ',
    a.small( a.i( data.description ) ),
  ] ),

  a.p( [

    data.item && data.item.edit ? app.btn(
      app.fa( "tag", data.type ),
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
      app.fa( "trash", `Delete ${ data.type }` ),
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
    data.created ?
      [
        "Created",
        x.timeago( data.created )
      ] :
      [ "Creation date unknown" ],
    [ "Modified", x.timeago( data.modified ) ],
  ] ) ),

]

app.navbar.pills = (r) => (a,x) => {

  let location = r.path.replace( /^\/volumes/, '')
  // if ( location === '/~dir' ) location = '/'
  let path_match = location.match( /^((.*)\/~(dir|subdir|file))(.*)$/ )

  let base_path
  let entry_type
  let action
  let segments

  if ( path_match ) {
    base_path = path_match[2]
    entry_type = path_match[3]
    action = path_match[4]
    segments = base_path.split( '/' )
  } else {
    base_path = '/'
    entry_type = 'dir'
    action = ''
    segments = ['']
  }

  let scope = ''
  let pills = []
  let up_path

  let last_i = segments.length - 1
  let up_i = last_i - ( action ? 0 : 1 )

  segments.forEach( ( segment, i) => {

    let path = `${ scope }${ segment }`
    let component

    // debugger
    if ( i === 0 && i === last_i ) {
// component = app.btn( app.fa( 'home' ), ()=> r.open( `/volumes/~dir` ) )
  component = a['.pill-selected']( app.fa( "home" ) )
      // if ( base_path === location ) {
      // } else {
      // }
    } else if ( i === 0 ) {
      component = app.btn( app.fa( 'home' ), ()=> r.open( `/volumes/~dir` ) )
    } else if ( i === last_i ) {
      let fa = entry_type === "dir" ? "folder" : "file-o"
      if ( action ) {
        component = app.btn(
          app.fa( fa, decodeURIComponent( segment ) ),
          ()=> r.open( `/volumes${ path }/~${ entry_type }` )
        )
        up_path = `/volumes${ path }/~${ entry_type }`
      } else {
        component = a['.pill-selected']( app.fa(
          fa, decodeURIComponent( segment )
        ) )
        up_path = `/volumes${ scope }~dir`
      }
    } else {
      component = app.btn(
        app.fa( 'folder', decodeURIComponent( segment ) ),
        ()=> r.open( `/volumes${ path }/~dir` )
      )
    }

    pills.push( component )

    scope = `${ path }/`

  } )

  let component = [
    ( pills.length > 1 ) ? app.btn(
      app.fa( 'arrow-up' ),
      ()=> r.open( up_path ),
      "link float-right"
    ) : null,
    pills,
  ]

  return a["p.pills"]( component )

}

app.views.sign_in.redirect = '/volumes/~dir'

app.views.show_dir.fixes = function( r, data ) {

  let unknown = data.entries.some( function( entry ) {
    return entry.status === "unknown"
  } )

  let missing = data.entries.some( function( entry ) {
    return entry.status === "missing"
  } )

  if ( unknown || missing ) {
    return (a,x) => a.p( [
      a.hr(),
      unknown ?
        app.btn(
          app.fa( "minus-square", "Remove unknown" ),
          () => r.open( `${ r.path }/unknown` ),
          "link float-right"
        ) : null,
      missing ?
        app.btn(
          app.fa( "plus-square", "Add missing" ),
          () => r.open( `${ r.path }/missing` ),
          "link"
        ) : null,
    ], { class: "clearfix" } )
  } else {
    return null
  }

}

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

app.views.show_dir.entry = function( r, entry ) {

  if ( entry.status === "present" ) {

    return (a,x) => a.p( [
      app.btn(
        app.fa(
          app.views.show_dir.entry.icon( entry ),
          entry.label
        ),
        () => r.open( `/${ entry.path }` )
      ),
      a.i( entry.description ),
    ] )

  } else {

    return (a,x) => a.p( [
      a[".bad-entry"](
        app.fa(
          app.views.show_dir.entry.icon( entry ),
          entry.label
        )
      ),
      a.i( entry.description ),
    ] )

  }

}

app.views.show_file.as = ( r, data ) => (a,x) => {

  let component = []

  if ( data.as === "link" ) {

    let link = data.link || {}
    let href = link.href
    let label = link.label || "Link"

    component.push(
      a.hr,
      a.a(
        app.fa( "external-link", label ),
        { href: href, target: href, class: 'btn btn-link' }
      ),
      a.hr,
    )

  } else if ( data.as === "iframe" ) {

    component.push(
      `/open/${ data.path }`,
      a.iframe(
        { src: `/iframe/${ data.path }`, class: "file-open-iframe" }
      ),
      a.p("Hi"),
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

app.views.show_dir.entry.icon = function( entry ) {

  if ( entry.entry_type === "file" ) {
    if ( entry.status === "missing" ) {
      return "exclamation"
    } else if ( entry.status === "unknown" ) {
      return "question"
    } else {
      return "file-o"
    }
  } else {
    if ( entry.status === "missing" ) {
      return "exclamation-circle"
    } else if ( entry.status === "unknown" ) {
      return "question-circle"
    } else {
      return "folder"
    }
  }

}
