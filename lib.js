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
  setState(newState) {
    this.state = Object.assign({}, this.state, newState)
  }
}
