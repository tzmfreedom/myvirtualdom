class Converter {
  constructor(context) {
    this.context = context;
  }

  convert(el, variables = {}) {
    switch (el.nodeType) {
      case Node.ELEMENT_NODE:
        const attributes = {};
        for (let i = 0; i < el.attributes.length; i++) {
          const node = el.attributes[i];
          attributes[node.name] = this.evalText(node.value, variables);
        }
        if (el.tagName === 'if') {
          const c = this.evalText(`{${el.attributes.c.value}}`, variables);
          if (!c) {
            return null;
          }
          const children = this.convertChildren(el, variables);
          return new Element('div', attributes, children)
        }
        if (el.tagName === 'for') {
          // TODO: impl
          const records = this.evalText(`${el.attributes.records.value}`, variables);
          const v = el.attributes.var.value;
          return records.map((record) => {
            variables[v] = record;
            const children = Array.from(el.children).map((child) => {
              return this.convert(child, variables);
            }).filter(v => v).flat();
            variables[v] = null;
            return new Element('div', attributes, children)
          })
        }

        const children = this.convertChildren(el, variables);
        if (/^[A-Z].*$/.test(el.tagName)) {
          const klass = eval(el.tagName);
          return (new klass(attributes, this.context.context)).renderTree();
        }
        return new Element(el.tagName, attributes, children);
      case Node.TEXT_NODE:
        return new Text(this.evalText(el.text, variables));
    }
  }

  convertChildren(el, variables) {
    if (!el.children) {
      return [];
    }
    const children = Array.from(el.children).map((child) => {
      return this.convert(child, variables);
    }).filter(v => v);
    if (children.length === 0 && el.textContent) {
      children.push(new Text(this.evalText(el.textContent, variables)));
    }
    return children.flat();
  }

  evalText(text, variables) {
    return this.context.evalText(text, variables);
  }
}
