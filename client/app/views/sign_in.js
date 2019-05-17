app.views.sign_in = (r) => (a,x) => a["app-sign-in"]( [

  a.h3( "Authentication" ),

  x.appkit.form( (f) => [
    a.input( {
      name: "username",
      value: "ERM User Token",
      style: {
        height: 0,
        margin: 0,
        padding: 0,
        border: 0,
        display: "block",
      },
    } ),
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
