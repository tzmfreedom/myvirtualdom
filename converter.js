class Converter {
  constructor(context) {
    this.context = context;
  }

  convert(el) {
    switch (el.nodeType) {
      case Node.ELEMENT_NODE:
        const attributes = {};
        for (let i = 0; i < el.attributes.length; i++) {
          const node = el.attributes[i];
          attributes[node.name] = this.evalText(node.value);
        }
        let children = [];
        if (el.children) {
          children = Array.from(el.children).map((child) => {
            return this.convert(child);
          }).filter(v => v);
          if (children.length === 0 && el.textContent) {
            children.push(new Text(this.evalText(el.textContent)));
          }
        }

        if (el.tagName === 'if') {
          const c = this.evalText(`{${el.attributes.c.value}}`);
          if (!c) {
            return null;
          }
          return new Element('div', attributes, children)
        }

        if (/^[A-Z].*$/.test(el.tagName)) {
          const klass = eval(el.tagName);
          return (new klass(attributes, this.context.context)).render();
        }
        return new Element(el.tagName, attributes, children);
      case Node.TEXT_NODE:
        return new Text(this.evalText(el.text));
    }
  }

  evalText(text) {
    return this.context.evalText(text);
  }
}
