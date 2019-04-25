app.views = (r) => (a,x) => x.appkit.http(
  `/api${ r.path }`,
  {
    resolver: app.views.resolver(r),
  }
)
