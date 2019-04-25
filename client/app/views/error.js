app.views.error = function( r, data ) {

  return (a,x) => a["app-view-error"]( {
    $show: function( err ) {
      this.$nodes( a.p( err, { class: "alert alert-warning" } ) )
    }
  } )

}
