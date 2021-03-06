'use strict'
/**
 * Creates an HTML element and inserts it in the DOM.
 * The element is described by a component and any accompanying attributes.
 * If the element has an `id`, it will replace an existing
 * DOM element that has the same `id`.
 * If the element does not have a matching `id`,
 * the element will be appended to the &lt;body&gt;.
 *
 * @since 0.0.0
 * @namespace
 *
 * @param {component} component any Component
 * @param {object} attributes to be applied to the component
 *
 * @return {htmlElement} The new element
 */
let ax = function ( component, attributes ) {

  let target

  if ( attributes ) {
    if ( ! ( component instanceof Array ) ) { component = [ component ] }
    component = { $nodes: component, ...attributes }
  }

  document.addEventListener("DOMContentLoaded", function(e) {

    let element = ax.factory( component )

    if ( component.id ) {
      document.querySelector( '#' + component.id ).
        replaceWith( element )
    } else {
      document.body.appendChild( element )
    }

  });


  // return element

}


// let ax = function ( component, attributes ) {
//
//   let target
//
//
//
//   if ( attributes ) {
//     if ( !ax.type.is.array( component ) ) { component = [ component ] }
//     component = { $nodes: component, ...attributes }
//   }
// debugger
//   let element = ax.factory( component )
//
//   if ( ax.type.is.nodelist( element ) ) {
//     for ( let i of element ) {
//       // debugger
//       document.body.appendChild( element[0] )
//     }
//   } else {
//     // debugger
//     if ( component.id ) {
//       document.querySelector( '#' + component.id ).
//       replaceWith( element )
//     } else {
//       document.body.appendChild( element )
//     }
//   }
//
//   return element
//
// }

/**
 * Extension namespace.
 * Extensions are installed here.
 *
 * @since 0.0.0
 * @namespace ax.extension
 *
 */
ax.extension = {}

/**
 * Type namespace.
 * For determing data types of variables.
 *
 * @since 0.0.0
 * @namespace ax.type
 *
 */
ax.type = {}

/**
 * Tag Generator namespace.
 * The Tag Generator creates arbitrary HTML elements.
 * It is instantiated as `ax.a`.
 *
 * @since 0.0.0
 * @namespace ax.tag
 *
 */
ax.tag = {}

/**
 * Throw an error.
 *
 * @since 0.0.0
 * @namespace ax.throw
 *
 * @param {string} message
 *
 */
ax.throw = function( message ) {
  throw new Error( message )
}

/**
 * Log a message.
 *
 * @since 0.0.0
 * @namespace ax.log
 *
 * @param {string} message
 *
 */
ax.log = console.log.bind( console )

// function( message ) {
//   // console.log.bind(window.console)( message )
//   console.log.bind( console )
// }

/**
 * Component Factory.
 * The Component Factory turns Components into View Objects.
 *
 * @since 0.0.0
 * @namespace ax.factory
 *
 * @param {component} component
 *
 * @return {component} Being either an Element, Node or View Object.
 */
ax.factory = function( component ) {

  let is = ax.type.is
// debugger
  if ( is.null( component ) ) return null
  if ( is.node( component ) ) return component
  if ( is.nodelist( component ) ) return ax.factory.nodelist( component )
  if ( is.array( component ) ) return ax.factory.array( component )
  if ( is.promise( component ) ) return ax.factory.promise( component )
  if ( is.object( component ) ) return ax.factory.object( component )
  if ( is.function( component ) ) return ax.factory.function( component )
  if ( is.undefined( component ) ) ax.factory.undefined()
  return ax.factory.text( component )

}

/**
 * Log a warning.
 *
 * @since 0.0.0
 * @namespace ax.warn
 *
 * @param {string} message
 *
 */
ax.warn = console.warn.bind( console )

ax.x = ax.extension

/**
 * Type Is Checkers namespace.
 * Type Is Checkers check data types.
 *
 * @since 0.0.0
 * @namespace ax.type.is
 *
 */
ax.type.is = {}

ax.factory.undefined = function () {

  ax.throw( "Component is undefined." )
  // return null

}

ax.factory.text = function ( component ) {

  return document.createTextNode( ' ' + component + ' ' )

}

ax.factory.object = function ( component ) {

  return this.object.element( component )

}

ax.factory.promise = function ( component ) {

  let output = function( args ) {
    if ( args.length === 1 ) {
      args = args[0]
    }
    if ( ax.type.is.string( args ) ) {
      return args
    } else {
      return JSON.stringify( args, null, 2  )
    }
  }

  return this( {
    $init: (el) => {
      component.then(
        function( ...args ) { el.$text = output( args ) }
      ).catch(
        function( ...args ) { el.$text = output( args ) }
      )
    }
  } )

}

ax.factory.pipeline = []

ax.factory.nodelist = function ( component ) {
  return this( { $nodes: Array.from( component ) } )
}

ax.factory.array = function ( component ) {
  return this( { $tag: "div", $nodes: component } )
}

ax.factory.function = function ( component ) {

  const a = ax.a
  const x = ax.x

  // The factory checks functions for an $object property.
  // If it finds one, the factory will use its value
  // as the component.
  // For example, the component a['div'] will render an empty <div>.
  // This is so that the tag builder
  // can return uncalled functions and the factory can
  // do something sensible with them. Otherwise such components
  // would be called with (a,x) arguments, which would be wrong.

  if ( ax.type.is.class( component ) ) {
    component = new component( a,x )
  } else if ( ax.type.is.tag( component ) ) {
    component = component()
  } else {
    component = component( a,x )
  }

  return this( component )

}

/**
 * Tag Generator proxy namespace.
 *
 * @since 0.0.0
 * @namespace ax.tag.proxy
 *
 */
ax.tag.proxy = {}

ax.tag.collection = {}

/**
 * Type Is Not Something.
 * Determines whether variable is not a type.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.not = new Proxy(
  {},
  {
    get: ( target, property, receiver ) => {

      if ( ax.type.is.function( ax.type.is[ property ] ) ) {
        return ( value ) => !ax.type.is[ property ]( value )
      } else {
        ax.throw( `ax.type.is does not support .${ property }()` )
      }

    }
  }
)

/**
 * Type Is Undefined Checker.
 * Determines whether variable is undefined.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.undefined = function ( variable ) {
  return variable === void 0
}

/**
 * Type Is Object Checker.
 * Determines whether variable is an object.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.object = function ( variable ) {
  return typeof variable === "object"
}

/**
 * Type Is Promise Checker.
 * Determines whether variable is a Promise.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.promise = function ( variable ) {
  return variable instanceof Promise
  // Promise.resolve( variable ) === variable
}

/**
 * Type Is Null Checker.
 * Determines whether variable is null.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.null = function ( variable ) {
  return variable === null
}

/**
 * Type Is Tag Checker.
 * Determines whether variable is a Tag Generator Proxy function.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.tag = function ( variable ) {
  return '' + ax.a.tagProxyFunction === '' + variable
}

/**
 * Type Is Number Checker.
 * Determines whether variable is number.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.number = function ( variable ) {
  return typeof variable === "number"
}

/**
 * Type Is NodeList Checker.
 * Determines whether variable is an HTML node list.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.nodelist = function ( variable ) {
  return variable instanceof NodeList
}

/**
 * Type Is Array Checker.
 * Determines whether variable is an array.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.array = function ( variable ) {
  return variable instanceof Array
}

/**
 * Type Is Function Checker.
 * Determines whether variable is a function.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.function = function ( variable ) {
  return typeof variable === "function"
}

/**
 * Type Is Class Checker.
 * Determines whether variable is a class.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.class = function ( variable ) {
  return this.function( variable ) && ( '' + variable ).slice(0,5) === 'class'
}

/**
 * Type Is Node Checker.
 * Determines whether variable is an HTML node.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.node = function ( variable ) {
  return variable instanceof Node
}

/**
 * Type Is String Checker.
 * Determines whether variable is a string.
 *
 * @since 0.0.0
 *
 * @param variable
 *
 * @return {boolean}
 *
 */
ax.type.is.string = function ( variable ) {
  return typeof variable === "string"
}

ax.factory.pipeline.push( function( object ) {

  return object

} )

ax.factory.object.base = { $tag: 'span' }

ax.factory.object.traverse = function( element, selector ) {

  if ( !element ) {
    return null
  } else if ( /^\s*\^/.test( selector ) ) {
    selector = selector.replace( /^\s*\^\s*/, '' )
    if ( selector ) {
      return element.closest( selector )
    } else {
      return element.parentElement
    }
  } else if ( /^\s*$/.test( selector ) ) {
    return element
  } else {
    return element.querySelector( selector )
  }

}

ax.factory.object.query = function( collection, pending=[] ) {

  return new Proxy(
    function () {},
    ax.factory.object.query.proxy.shim( collection, pending )
  )

}

ax.factory.object.element = function ( object ) {

  object = { ...this.base, ...object }
  let element = document.createElement( object.$tag )
  element.$object = object

  ax.factory.pipeline.forEach( function( pipelineFunction ) {
    element.$object = pipelineFunction( element.$object )
  } )

  return this.element.properties.init(
    this.element.properties( element ).$render()
  )

}

ax.tag.collection.proxy = () => new Proxy( ax.tag.collection.function, ax.tag.collection.shim )

ax.tag.collection.function = () => {}

ax.tag.collection.shim = {
 get: ( target, property ) => {
  //  ax.log( property )

   return function( ...components ) {
// debugger
     return components.map( function( component ) {
       return ax.a[ property ]( component )
     } )
   }



    //  return function ( component, attributes={} ) {
    //    component = ax.tag.proxy.shim.component( component )
    //    attributes = ax.tag.proxy.shim.attributes( property, attributes )
    //    return ax.factory.object( { ...component, ...attributes } )
    //  }

 }
}

/**
 * Tag Generator proxy shim.
 * Creates arbitrary View Objects.
 * Intercepts get methods and returns a function that,
 * when called, returns a View Object with
 * the $tag property set to the method name for the get.
 *
 * @since 0.0.0
 * @namespace ax.tag.proxy
 *
 */
 ax.tag.proxy.shim = {
  get: ( target, property ) => {
    // ax.log( property )
    if ( property === '$$' ) {
 // debugger
      return ax.tag.collection.proxy()

    } else {

      return function ( component=null, attributes={} ) {
        component = ax.tag.proxy.shim.component( component )
        attributes = ax.tag.proxy.shim.attributes( property, attributes )
        return ax.factory.object( { ...component, ...attributes } )
      }

    }
  }
}

// ax.tag.collection = {}
//
//
//
// ax.tag.collection.function = () => {}
//
// ax.tag.collection.shim = {
//  get: ( target, property ) => {
//   //  ax.log( property )
//
//    return function( ...components ) {
// // debugger
//      return components.map( function( component ) {
//        return ax.a[ property ]( component )
//      } )
//    }
//
//
//
//     //  return function ( component, attributes={} ) {
//     //    component = ax.tag.proxy.shim.component( component )
//     //    attributes = ax.tag.proxy.shim.attributes( property, attributes )
//     //    return ax.factory.object( { ...component, ...attributes } )
//     //  }
//
//  }
// }
//
// ax.tag.collection.proxy = () => new Proxy( ax.tag.collection.function, ax.tag.collection.shim )

/**
 * Tag Generator proxy function.
 * Accepts an HTML fragment and returns a Node or NodeList.
 *
 * @since 0.0.0
 * @namespace ax.tag.proxy
 *
 */
ax.tag.proxy.function = function( html ) {

    let jig = document.createElement('div')
    jig.innerHTML = html
    return jig.childNodes

}

ax.factory.object.element.properties = function ( element ) {

  return  this.properties.render(
          this.properties.events(
          this.properties.accessors(
          this.properties.define( element ) ) ) )

}

ax.factory.object.element.process = function ( element ) {

  ax.factory.pipeline.forEach( function( pipelineFunction ) {
    element.$object = pipelineFunction( element.$object )
  } )

  return  this.process.properties( element )

}

ax.factory.object.element.
append = function ( element, component ) {

  let children = ax.factory( component )
  if ( ax.type.is.array( children ) ) {
    children.forEach( function ( child ) {
      element.appendChild( child )
    } )
  } else {
    element.appendChild( children )
  }

}

ax.factory.object.query.proxy = {}

ax.factory.object.base.$$ = function( selector ) {

    return ax.factory.object.query(
      Array.from( this.querySelectorAll( selector ) )
    )

}

ax.factory.object.base.$ = function( ...selectors ) {
  let result = this
  selectors.forEach( function( selector ) {
    if ( ax.type.is.array( selector ) ) {
      result = result.$( ...selector )
    } else if ( /^\^\S*$/.test( selector ) ) {
      result = ax.factory.object.traverse( result, selector )
    } else if ( /\^/.test( selector ) ) {
      selector = selector.split(/(\^\S*)/g)
      result = result.$( ...selector )
    } else {
      result = ax.factory.object.traverse( result, selector )
    }
  } )
  return result
}

ax.tag.proxy.shim.component = function ( component ) {

  let is = ax.type.is
// debugger
  if ( is.node( component ) ) return { $nodes: [ component ] }
  if ( is.nodelist( component ) ) return { $nodes: [ Array.from( component ) ] }
  if ( is.array( component ) ) return { $nodes: component }
  if ( is.object( component ) ) return component
  if ( is.function( component ) ) return { $nodes: [ component ] }
  if ( is.undefined( component ) ) ax.factory.undefined()
  return { $text: component }

  // return ax.factory( component )

}

// ax.tag.proxy.shim.component = function ( component ) {
//
//   let is = ax.type.is
// // debugger
//   if ( is.node( component ) ) return { $nodes: [ component ] }
//   if ( is.nodelist( component ) ) return { $nodes: [ Array.from( component ) ] }
//   if ( is.array( component ) ) return { $nodes: component }
//   if ( is.object( component ) ) return component
//   if ( is.function( component ) ) return { $nodes: [ component ] }
//   if ( is.undefined( component ) ) return {}
//   return { $text: component }
//
// }

// ax.tag.proxy.shim.component = function ( component ) {
//
//   let is = ax.type.is
// // debugger
//   if ( is.null( component ) ) return null
//   if ( is.node( component ) ) return { $nodes: [ component ] }
//   if ( is.nodelist( component ) ) return { $nodes: [ Array.from( component ) ] }
//   if ( is.array( component ) ) return { $nodes: component }
//   if ( is.promise( component ) ) return { $nodes: [ component ] }
//   if ( is.object( component ) ) return component
//   if ( is.function( component ) ) return { $nodes: [ component ] }
//   // if ( is.undefined( component ) ) {
//   //   // debugger
//   //   return { $text: "UNDEFINED" }
//   //   // return ax.factory.undefined()
//   // }
//   return component
//
// }
//
//
// // if ( is.null( component ) ) return null
// // if ( is.node( component ) ) return component
// // if ( is.nodelist( component ) ) return ax.factory.nodelist( component )
// // if ( is.array( component ) ) return ax.factory.array( component )
// // if ( is.promise( component ) ) return ax.factory.promise( component )
// // if ( is.object( component ) ) return ax.factory.object( component )
// // if ( is.function( component ) ) return ax.factory.function( component )
// // if ( is.undefined( component ) ) return ax.factory.undefined()
// // return ax.factory.text( component )

ax.tag.proxy.shim.attributes = function ( property, attributes ) {

  // if the property starts with a word, use the word as tag
  // if the property has a '#' word, use as id
  // if the property has '.' words, use as class
  // e.g. div#myTagId.btn.btn-primary

  let tag = ( property.match(/^([\w|-]+)/) || [] )[1]
  let id = ( property.match(/#([\w|-]+)/) || [] )[1]
  let klass = ( property.match(/\.([\.|\w|-]+)/) || [] )[1]

  if ( tag ) attributes.$tag = tag
  if ( id ) attributes.id = id
  if ( klass ) attributes.class = klass.replace( /\./g, ' ')

  return attributes

}

ax.a = new Proxy( ax.tag.proxy.function, ax.tag.proxy.shim )

ax.factory.object.element.properties.accessors = function ( element ) {

  return  this.accessors.nodes(
          this.accessors.html(
          this.accessors.text(
          this.accessors.on(
          this.accessors.state( element ) ) ) ) )

}

ax.factory.object.element.properties.render = function ( element ) {

  let render = this.render

  element.$render = function () {

    if ( element.$object.hasOwnProperty( '$text' ) ) {
      return render.text( element )
    } else if ( element.$object.hasOwnProperty( '$html' ) ) {
      return render.html( element )
    } else if ( element.$object.hasOwnProperty( '$nodes' ) ) {
      return render.nodes( element )
    } else {
      return element
    }

  }

  return element

}

ax.factory.object.element.properties.init = function ( element ) {

  if ( element.$object.hasOwnProperty( '$init' ) ) {
    element.appendChild( ax.factory( {
      $tag: "script",
      type: "text/javascript",
      $html:  "(function(){" +
                "let script=document.currentScript;" +
                "let element=script.parentElement;" +
                "script.remove();" +
                "element.$init( element, element.$state() );" +
              "})()"
    } ) )
  }

  return element

}

ax.factory.object.element.properties.events = function ( element ) {

  return  this.events.$on(
          this.events.$off( element ) )

}

ax.factory.object.element.properties.define = function ( element ) {

  for ( let property in element.$object ) {
    if ( element.$object.hasOwnProperty( property ) ) {
      if ( /[a-zA-Z]/.test( property[0] ) ) {

        let value = element.$object[ property ]

        if ( value || value === "" ) {

          let isObject = ax.type.is.object( value )

          if ( isObject && property === "data" ) {
            this.define.data( element, value )
          } else if ( isObject && property === "style" ) {
            this.define.style( element, value )
          } else {
            this.define.attribute( element, property, value )
          }

        }

      } else {

        if (
          property != '$text' &&
          property != '$nodes' &&
          property != '$html' &&
          property != '$state' &&
          property != '$on'
        ) {
          element[ property ] = element.$object[ property ]
        }

      }
    }
  }

  return element

}

ax.factory.object.query.proxy.shim = function( collection, pending ) {

  return {
    get: ax.factory.object.query.proxy.shim.get( collection, pending ),
    set: ax.factory.object.query.proxy.shim.set( collection, pending ),
    apply: ax.factory.object.query.proxy.shim.apply( collection, pending ),
  }

}

/**
 * Writes an object's text content to its element
 *
 * @since 1.0.0
 *
 * @param {element} element An element with stale content.
 *
 * @return {element} The element with up-to-date content.
 */

ax.factory.object.element.properties.render.text = function ( element ) {

  // Get content from the element.
  let text = element.$text()

  // Resolve content function, if there is one.
  if ( ax.type.is.function( text ) ) {
    text = text.call( element, element, element.$state() )
  }

  // Clear exisitng content
  while (element.childNodes.length ) {
    element.removeChild(element.lastChild);
  }

  // Add new content
  element.appendChild( document.createTextNode( text ) )

  return element

}

ax.factory.object.element.properties.render.html = function ( element ) {

  let html = element.$html()

  if ( ax.type.is.function( html ) ) {
    html = html.call( element, element, element.$state() )
  }

  element.innerHTML = html

  return element

}

/**
* Writes an object's nodes content to its element
*
* @since 1.0.0
*
* @param {element} element An element with stale content.
*
* @return {element} The element with up-to-date content.
*/

ax.factory.object.element.properties.render.
nodes = function ( element ) {

  // Get content from the element.
  let nodes = element.$nodes()

  if ( ax.type.is.function( nodes ) ) {
    // nodes = nodes.bind( element )
    nodes = nodes.call( element, element, element.$state() )
  }

  // Clear existing content
  while ( element.firstChild ) {
    element.firstChild.remove()
  }

  // Add content
  if ( ax.type.is.array( nodes ) ) {
    nodes.forEach( function( node ) {
      node = ax.factory( node )
      if ( node != null ) element.appendChild( node )
    } )
  } else {
    let node = ax.factory( nodes )
    if ( node != null ) element.appendChild( node )
  }

  return element

}

ax.factory.object.element.properties.accessors.text = function ( element ) {

  let accessors = this

  Object.defineProperty( element, "$text", {
    get : function () {
      return accessors.text.query( element )
    },
    set : function( text ) {
      accessors.text.set( element, text )
    }
  } )

  return element

}

ax.factory.object.element.properties.accessors.html = function ( element ) {

  let accessors = this

  Object.defineProperty( element, "$html", {
    get : function () {
      return accessors.html.query( element )
    },
    set : function( html ) {
      accessors.html.set( element, nodes )
    }
  } )

  return element

}

ax.factory.object.element.properties.accessors.state = function ( element ) {

  let accessors = this

  Object.defineProperty( element, "$state", {
    get : function () {
      return accessors.state.query( element )
    },
    set : function( state ) {
      accessors.state.set( element, state )
    }
  } )

  return element

}

ax.factory.object.element.properties.accessors.on = function ( element ) {

  let accessors = this

  Object.defineProperty( element, "$on", {
    get : function () {
      return accessors.on.query( element )
    },
    set : function( on ) {
      accessors.nodes.set( element, on )
    }
  } )

  return element

}

ax.factory.object.element.properties.accessors.nodes = function ( element ) {

  let accessors = this

  Object.defineProperty( element, "$nodes", {
    get : function () {
      return accessors.nodes.query( element )
    },
    set : function( nodes ) {
      accessors.nodes.set( element, nodes )
    }
  } )

  return element

}

ax.factory.object.element.properties.events.$on = function ( element ) {

  if ( element.$object.hasOwnProperty( '$on' ) ) {
    for ( let event in element.$object.$on ) {
      element.addEventListener(
        event.split(':')[0],
        function(e) {
          element.$object.$on[ event ] &&
          element.$object.$on[ event ].
            call( this, e, element, element.$state() )
        }
      )
    }
  }

  return element

}

ax.factory.object.element.properties.events.$off = function ( element ) {

  element.$off = function ( event ) {
    element.removeEventListener(
      event.split(':')[0],
      element.$object.$on[ event ]
    )
  }

  return element

}

ax.factory.object.element.properties.define.
style = function ( element, object ) {

  let result = ""

  Object.keys( object ).forEach( function( key ) {
    // if ( !ax.type.is.object( object[property] ) ) {
      let kebab = this.kebab( key )
      result += ( kebab + ": " + object[key] + "; ")
    // }
  }.bind( this ) )

  this.attribute( element, "style", result )

}

ax.factory.object.element.properties.define.
attribute = function ( element, property, value ) {

  let attribute = document.createAttribute( property )
  attribute.value = value
  element.setAttributeNode( attribute )

}

ax.factory.object.element.properties.define.kebab = function ( name ) {

  // Convert name from camelCase to kebab-case
  return ( name[0].match(/[A-Z]/) ? "-" : "" ) + name.
    replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()

}

ax.factory.object.element.properties.define.data = function ( element, object ) {

  this.data.attribute( element, [ 'data' ], object )


}

ax.factory.object.query.proxy.shim.get = function( collection, pending ) {

  return function( target, property, receiver ) {

    if ( /^\d+$/.test( property ) ) return collection[ property ]
    collection.forEach( function( node, i ) {
      let result = node[ property ]
      if ( ax.type.is.function( result ) ) {
        pending[i] = result
      } else {
        collection[i] = result
      }
    } )

    return ax.factory.object.query( collection, pending )

  }

}

ax.factory.object.query.proxy.shim.set =
function( collection, pending ) {

  return function( target, property, value, receiver ) {

    collection.forEach( function( node ) {
      node[ property ] = value
    } )

    return true

  }

}

ax.factory.object.query.proxy.shim.apply = function( collection, pending ) {

  return function( target, receiver, args ) {
    if ( pending.length ) {
      collection.forEach( function( node, i ) {
        collection[i] = pending[i].call( node, ...args )
      } )
      return ax.factory.object.query( collection )
    } else {
      return collection
    }

  }

}

ax.factory.object.element.properties.accessors.state.
set = function ( element, state ) {

  if ( element.$object.$state === state ) return

  element.$object.$state = state

  if ( element.$object.$update ) {
    element.$object.$update.
      call( element, element, element.$object.$state ) &&
    element.$render()
  } else {
    element.$render()
  }

  return element

}

ax.factory.object.element.properties.accessors.state.
query = function ( element ) {

  let state = this

  return function() {

    if ( arguments.length === 1 ) {
      return state.set( element, arguments[0] )
    } else if ( arguments.length ) {
      return state.set( element, arguments )
    } else {
      return element.$object.$state
    }
  }
}

ax.factory.object.element.properties.accessors.text.
set = function ( element, text ) {

  delete element.$object.$html
  delete element.$object.$nodes
  element.$object.$text = text
  element.$render()

  return element

}

ax.factory.object.element.properties.accessors.text.
query = function ( element ) {

  let text = this

  return function() {

    if ( arguments.length === 1 ) {
      return text.set( element, arguments[0] )
    } else if ( arguments.length ) {
      return text.set( element, arguments.join() )
    } else {
      return element.$object.$text
    }
  }
}

ax.factory.object.element.properties.accessors.on.
set = function ( element, on ) {

  for ( let event in on ) {
    element.$off( event )
    element.$object.$on[ event ] = on[ event ]
    element.addEventListener(
      event.split(':')[0],
      element.$object.$on[ event ]
    )
  }

  return element

}

ax.factory.object.element.properties.accessors.on.
query = function ( element ) {

  let on = this

  return function() {

    if ( arguments.length === 1 ) {
      return on.set( element, arguments[0] )
    } else if ( arguments.length ) {
      return on.set( element, arguments.join() )
    } else {
      return element.$object.$on
    }
  }
}

ax.factory.object.element.properties.accessors.nodes.
set = function ( element, nodes ) {

  delete element.$object.$text
  delete element.$object.$html
  element.$object.$nodes = nodes
  element.$render()

  return element

}

ax.factory.object.element.properties.accessors.nodes.
query = function ( element ) {

  let nodes = this

  return function() {

    if ( arguments.length === 1 ) {
      return nodes.set( element, arguments[0] )
    } else if ( arguments.length ) {
      return nodes.set( element, arguments )
    } else {
      return element.$object.$nodes
    }
  }
}

ax.factory.object.element.properties.accessors.html.
set = function ( element, html ) {

  delete element.$object.$text
  delete element.$object.$nodes
  element.$object.$html = html
  element.$render()

  return element

}

ax.factory.object.element.properties.accessors.html.
query = function ( element ) {

  let html = this

  return function() {

    if ( arguments.length === 1 ) {
      return html.set( element, arguments[0] )
    } else if ( arguments.length ) {
      return html.set( element, arguments.join() )
    } else {
      return element.$object.$html
    }
  }
}

ax.factory.object.element.properties.define.data.
attribute = function ( element, keys, value ) {

  let context = ax.factory.object.element.properties.define

  if ( ax.type.is.string( value ) ) {
    let kebab = keys.join('-')
    context.attribute( element, kebab, value )
  } else {
    Object.keys( value ).forEach( function( key ) {
      let kebab = context.kebab( key )
      this.attribute( element, keys.concat( key ), value[ key ] )
    }.bind( this ) )
  }

}
