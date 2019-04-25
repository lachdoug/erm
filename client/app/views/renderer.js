app.views.renderer = ( r, data ) => (a,x) => {

  return a["app-view"]( [
    app.views.error( r, data ),
    app.views[ data.type ]( r, data )
  ] )

}
