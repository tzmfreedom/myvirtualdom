## My VirtualDOM Application

```html
<html>
<head></head>
<body>
  <div id="app"></div>
  <script src="./lib.js"></script>
  <script src="./redux.js"></script>
  <script src="./converter.js"></script>
  <script src="./app.js"></script>
  <script src="./main.js"></script>
</body>
</html>
```

```javascript
class App extends Base {
  onMounted() {
    this.state = {
      text: 0
    }
  }

  onChangeText(e) {
    this.setState({
      text: e.target.value
    });
    this.getStore().dispatch(changeMessage(e.target.value));
  }

  render() {
    const str = `<div>
  <if c="this.state.text.length === 0">
    <p>blank</p>
  </if>
  <if c="this.state.text.length !== 0">
    <p>{this.state.text}</p>
  </if>
  <p>{this.getStore().getState().message + '!!'}</p>
  <input type="text" value="{this.state.text}" oninput="{this.onChangeText.bind(this)}"/>
  <Foo text="{this.state.text}"/>
</div>`
    return this.template(str, this);
  }
}

class Foo extends Base {
  render() {
    return h('div', [], [t(this.props.text)])
  }
}

const store = createStore();
const manager = new AppManager('#app', new App())
manager.render()
```
