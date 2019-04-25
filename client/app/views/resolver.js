app.views.resolver = (r) => ( el, dataPromise ) => [
  dataPromise.then( ( data ) => {
    el.$nodes = () => app.views.renderer( r, data )
  } ).catch( ( err ) => {
    ax.log( err )
    el.$nodes = [ (a,x) => x.appkit.put( err.message ) ]
  } )
]
