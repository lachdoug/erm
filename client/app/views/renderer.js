app.views.renderer = ( r, data ) => (a,x) => {

  return a["app-view"]( [
    // app.views.error( r, data ),
    app.views.sign_out(r),
    app.views[ data.view ]( r, data )
  ] )

}
