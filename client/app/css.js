app.css = (a,x) => x.appkit.document.css( [

  {
    ".error": {
      color: "red",
    },
    ".pills": {
      padding: "0 .375rem",
      ".btn": {
        padding: "0 .375rem"
      },
      ".pill-selected": {
        border: "1px solid transparent",
        verticalAlign: "middle",
        padding: ".375rem",
        color: "grey",
      }
    },
    ".order-dir": {
      ul: {
        listStyleType: "none",
        padding: 0,
      },
      ".order-dir-item": {
        padding: ".375rem 0",
        border: "1px solid transparent",
        cursor: "grab",
        "appkit-icon" : {
          padding: "0 0.75rem",
        }
      }
    },
    "appkit-list": {
      fontFamily: "monospace",
      whiteSpace: "pre",
      color: "lightgrey",
      "appkit-list-type-null": {
        color: "red"
      },
      "appkit-list-type-number": {
        color: "green"
      },
      "appkit-list-type-text": {
        color: "blue",
        maxHeight: "300px",
        display: "inline-block",
      },
      "ul, ol": {
        padding: "0 0 0 20px",
      },
      label: {
        fontWeight: "bold",
        color: "grey",
        margin: "0px",
        verticalAlign: "top",
      }
    },
    ".CodeMirror-scroll": {
      maxHeight: "80vh",
    },
    ".fullscreen .CodeMirror-scroll": {
      maxHeight: "unset",
    },
  },
  config.css || {}
] )
