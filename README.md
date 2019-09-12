## My VirtualDOM Application

```html
<html>
<head></head>
<body>
  <div id="app"></div>
  <script src="./lib.js"></script>
  <script src="./app.js"></script>
  <script src="./main.js"></script>
</body>
</html>
```

```javascript
class App extends Base {
  constructor() {
    super()
    this.state = {
      text: 0
    }
  }

  render() {
    return h('div', {}, [
      h('p', {
        onclick: ((e) => {
          this.setState({
            text: this.state.text + 1
          })
        }).bind(this)
      }, [
        t(this.state.text)
      ])
      h('input', {
        type: 'text',
        onkeyup: ((e) => {
          this.setState({
            text: e.target.value
          })
        }).bind(this),
        value: this.state.text
      }, [])
    ])
  }
}

const manager = new AppManager('#app', new App())
manager.render()
```
