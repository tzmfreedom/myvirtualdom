class Element {
  constructor(tag, attributes, children) {
    this.tag = tag;
    this.attributes = attributes;
    this.children = children;
  }
}

class Text {
  constructor(text) {
    this.text = text;
  }
}

function h(tag, attributes, children) {
  return new Element(tag, attributes, children)
}

function t(text) {
  return new Text(text)
}

class AppManager {
  constructor(selector, app) {
    this.currentTree = null;
    this.currentRoot = null;
    this.app = app;
    this.selector = selector
  }

  scheduleRender() {
    if (!this.skipRender) {
      this.skipRender = true;
      setTimeout(this.render.bind(this));
    }
  }

  render() {
    const newTree = this.app.render()
    if (this.currentRoot === null) {
      this.currentRoot = document.querySelector(this.selector);
      this.currentRoot.appendChild(this.createElement(newTree))
    } else {
      this.replaceNode(this.currentRoot, this.currentTree, newTree, 0)
    }
    this.currentTree = newTree
    this.skipRender = false
  }

  createElement(element) {
    if (element.constructor.name === 'Text') {
      return document.createTextNode(element.text);
    }
    const el = document.createElement(element.tag)
    for (let k in element.attributes) {
      const v = element.attributes[k]
      if (this.isEvent(k)) {
        const eventName = k.slice(2);
        el.addEventListener(eventName, (e) => {
          v(e)
          this.scheduleRender()
        })
      } else {
        el.setAttribute(k, v)
      }
    }
    element.children.forEach((child) => {
      el.append(this.createElement(child))
    })
    return el;
  }

  isEvent(name) {
    return /^on/.test(name)
  }

  replaceNode(el, oldNode, newNode, index) {
    if (!oldNode) {
      el.appendChild(this.createElement(newNode))
      return;
    }

    const target = el.childNodes[index]
    if (!newNode) {
      el.removeChild(target);
      return;
    }

    if (newNode.constructor.name !== oldNode.constructor.name) {
      el.replaceChild(this.createElement(newNode), target);
      return;
    }

    if (newNode.constructor.name === 'Text' && newNode.text !== oldNode.text) {
      el.replaceChild(this.createElement(newNode), target)
      return;
    }

    if (newNode.constructor.name === 'Element') {
      if (newNode.tag !== oldNode.tag) {
        el.replaceChild(this.createElement(newNode), target)
        return;
      }
      if (newNode.attributes.value !== oldNode.attributes.value) {
        target.value = newNode.attributes.value
        return;
      }
      if (JSON.stringify(newNode.attributes) !== JSON.stringify(oldNode.attributes)) {
        for (let attr in oldNode.attributes) {
          target.removeAttribute(attr)
        }
        for (let attr in newNode.attributes) {
          target.setAttribute(attr, newNode.attributes[attr])
        }
      }
      for (let i = 0; i < oldNode.children.length || i < newNode.children.length; i++) {
        this.replaceNode(target, oldNode.children[i], newNode.children[i], i)
      }
    }
  }
}

class Base {
  constructor(props, context) {
    this.props = props;
    this.context = context;
    this.onMounted();
  }

  onMounted() {}

  setState(newState) {
    this.state = Object.assign({}, this.state, newState)
  }

  getStore() {
    return this.context.store;
  }
}

function createStore(reducer) {
  let state = {};
  const listeners = [];
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };
  const subscribe = (listener) => listeners.push(listener);

  dispatch();

  return {
    dispatch,
    getState,
    subscribe,
  }
}

class Converter {
  convert(el) {
    switch (el.nodeType) {
      case Node.ELEMENT_NODE:
        const attributes = {};
        for (let i = 0; i < el.attributes.length; i++) {
          const node = el.attributes[i];
          attributes[node.name] = node.value;
        }
        let children = []
        if (el.children) {
          children = Array.from(el.children).map((child) => {
            return this.convert(child);
          });
        }
        return new Element(el.tagName, attributes, children);
      case Node.TEXT_NODE:
        return new Text(el.text);
    }
  }
}

const str = `
<div>
<h1>
<p id="123">text</p>
</h1>
<h2></h2>
</div>
`
const parser = new DOMParser();
const el = parser.parseFromString(str, 'application/xml');
const res = new Converter().convert(el.children[0])
