app.fa = function( icon, text ) {
  return (a,x) => x.appkit.icon( `fa fa-${ icon }`, text )
}
