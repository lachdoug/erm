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
