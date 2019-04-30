app.views.show_dir.entry.icon = function( entry ) {

  if ( entry.type === "file" ) {
    if ( entry.status === "missing" ) {
      return "exclamation"
    } else if ( entry.status === "unknown" ) {
      return "question"
    } else {
      return "file-o"
    }
  } else {
    if ( entry.status === "missing" ) {
      return "exclamation-circle"
    } else if ( entry.status === "unknown" ) {
      return "question-circle"
    } else {
      return "folder"
    }
  }

}
