'use strict'
let app = function(a,x) { return [
  app.css,
  x.appkit.router( (r) => [
    app.navbar(r),
    a["div.container"](
      r.routes( {
        '%%': app.views
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
    '%%': app.pills
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

app.pills = (r) => (a,x) => {

  let location = r.path
  if ( location === '/~dir' ) location = '/'
  let path_match = location.match( /^((.*)\/~(file|dir|subdir))(.*)$/ )

  let base_path
  let type
  let action
  let names

  if ( path_match ) {
    base_path = path_match[2]
    type = path_match[3]
    action = path_match[4]
    names = base_path.split( '/' )
  } else {
    base_path = '/'
    type = 'dir'
    action = ''
    names = ['']
  }

  let scope = ''
  let pills = []
  let up_path
  // debugger
  let last_i = names.length - 1
  let up_i = last_i - ( action ? 0 : 1 )

  names.forEach( ( name, i) => {

    let path = `${ scope }${ name }`
    let component

    if ( i === 0 && i === last_i ) {

      if ( base_path === location ) {
        component = a['.pill-selected']( app.fa( "home" ) )
      } else {
        component = app.btn( app.fa( 'home' ), ()=> r.open( `/` ) )
      }
    } else if ( i === 0 ) {
      component = app.btn( app.fa( 'home' ), ()=> r.open( `/` ) )
    } else if ( i === last_i ) {
      let fa = type === "dir" ? "folder" : "file-o"
      if ( action ) {
        component = app.btn(
          app.fa( fa, decodeURIComponent( name ) ),
          ()=> r.open( `${ path }/~${ type }` )
        )
        // debugger
        up_path = `${ path }/~${ type }`
      } else {
        component = a['.pill-selected']( app.fa(
          fa, decodeURIComponent( name )
        ) )
        // debugger
        up_path = `${ scope }~dir`
      }
    } else {
      component = app.btn(
        app.fa( 'folder', decodeURIComponent( name ) ),
        ()=> r.open( `${ path }/~dir` )
      )
    }

    pills.push( component )

    // if ( path && i === up_i ) up_path = `${ path }`

    scope = `${ path }/`

  } )
// debugger
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

app.views.edit_file = ( r, data ) => (a,x) => {

  let metadata = data.config.metadata || []

  return [
    a.h4( data.key ),
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
        text: `Update ${ data.label }`,
        buttonTag: { class: "btn btn-primary" },
      } ),
      // x.appkit.put( data ),
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
    a.h4( data.dirname ),
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
        text: `Update ${ data.label }`,
        buttonTag: { class: "btn btn-primary" },
      } ),
      // x.appkit.put( data ),
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
    app.views.error( r, data ),
    app.views[ data.type ]( r, data )
  ] )

}

app.views.resolver = (r) => ( el, dataPromise ) => [
  dataPromise.then( ( data ) => {
    el.$nodes = () => app.views.renderer( r, data )
  } ).catch( ( err ) => {
    ax.log( err )
    el.$nodes = [ (a,x) => x.appkit.put( err.message ) ]
  } )
]

app.views.delete_dir = ( r, data ) => (a,x) => [
  a.h4( `Delete ${ data.label }` ),
  a.p( [
    "Are you sure that you want to delete",
    a.strong( data.dirname ), "?"
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
      text: `Delete ${ data.key }`,
      buttonTag: { class: "btn btn-primary" },
    } ),
    // x.appkit.put( data ),
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
    a.h4( `New ${ data.label }` ),
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
        text: `Create ${ data.label }`,
        buttonTag: { class: "btn btn-primary" },
      } ),
      // x.appkit.put( data ),
    ], {
      action: `/api/${ data.path }/file`,
      scope: "file",
      success: function( data, el ) {
        r.open( `/${ data.path }` )
      },
    } )
  ]

}

app.views.error = function( r, data ) {

  return (a,x) => a["app-view-error"]( {
    $show: function( err ) {
      this.$nodes( a.p( err, { class: "alert alert-warning" } ) )
    }
  } )

}

app.views.delete_file = ( r, data ) => (a,x) => [
  a.h4( `Delete ${ data.label }` ),
  a.p( [
    "Are you sure that you want to delete",
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
      text: `Delete ${ data.label }`,
      buttonTag: { class: "btn btn-primary" },
    } ),
    // x.appkit.put( data ),
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
    a.h4( `New ${ data.label }` ),
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
        onclick: (e, el, form) => r.open( `/${ data.path }` ),
      } ),
      " ",
      f.submit( {
        icon: "fa fa-check",
        text: `Create ${ data.label }`,
        buttonTag: { class: "btn btn-primary" },
      } ),
    ], {
      action: `/api/${ data.path }/subdir`,
      scope: "dir",
      success: function( data, el ) {
        r.open( `/${ data.path }` )
      },
    } ),

    // x.appkit.put( data ),
  ]

}

app.views.edit_dir_order = ( r, data ) => (a,x) => {

  return [
    a.h4( `Order ${ data.name }` ),
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
                app.fa( entry.type === "file" ? "file-o" : "folder", entry.name ),
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

  data.metadata ? app.views.show_dir.metadata( r, data ) : null,

  a.hr,

  data.entries.length ?
  data.entries.map( ( entry, i ) => a.p( [
    app.btn(
      app.fa( entry.type === "file" ? "file-o" : "folder", entry.name ),
      () => r.open( `/${ entry.path }` )
    ),
    a.i( entry.description ),

  ] ) ) : a.i("No entries"),

  // x.appkit.put( data ),
  // x.appkit.put( r ),

  data.created ? [
    a.hr,
    a["p.text-center"]( a.small( [
      a.label( "Created" ), ' ', x.timeago( data.created ),
    ] ) ),
  ] : null,

]

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

app.views.edit_raw_file = ( r, data ) => (a,x) => [

  a.h4( [
    data.filename,
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
      text: `Update ${ data.label }`,
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

  // x.appkit.put( data ),

]

app.views.show_file = ( r, data ) => (a,x) => [

  a.h4( [
    data.filename,
    ' ',
    a.small( a.i( data.description ) ),
  ] ),

  a.p( [

    data.item && data.item.edit ? app.btn(
      app.fa( "tag", data.label ),
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
      app.fa( "trash", `Delete ${ data.label }` ),
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
        a.label( "Created" ), ' ',
        x.timeago( data.created )
      ] :
      [ "Creation date unknown" ],
    [ a.label( "Modified" ), ' ', x.timeago( data.modified ) ],
  ] ) ),

  // x.appkit.put( data ),

]

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
