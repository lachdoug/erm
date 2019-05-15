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
    '%%': app.navbar.pills
  } ) ),
  a.hr,

]
