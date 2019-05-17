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
