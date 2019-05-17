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
