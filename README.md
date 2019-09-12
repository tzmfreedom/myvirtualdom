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
      text: 0,
      records: ['hoge', 'fuga'],
    }
    fetch('https://httpbin.org/get').then((res) => {
      this.setState({
        text: res.statusText,
      });
      this.context.manager.scheduleRender();
    })
  }

  onChangeText(e) {
    this.setState({
      text: e.target.value
    });
    this.dispatch(changeMessage(e.target.value));
  }

  onClickButton() {
    this.state.records.push(this.state.text);
    this.setState({
      records: this.state.records,
    })
  }

  render() {
    return `<div>
  <if c="this.state.text.length === 0">
    <p>blank</p>
  </if>
  <if c="this.state.text.length !== 0">
    <p>{this.state.text}</p>
  </if>
  <ul>
    <for records="{this.state.records}" var="record">
      <li>{variables.record}</li>
    </for>
  </ul>
  <p>{this.getStoreState().message + '!!'}</p>
  <input type="text" value="{this.state.text}" oninput="{this.onChangeText.bind(this)}"/>
  <input type="button" value="Add" onclick="{this.onClickButton.bind(this)}"/>
  <Foo text="{this.state.text}"/>
</div>`
  }
}

class Foo extends Base {
  render() {
    return `<div>{this.props.text}</div>`;
  }
}
```

### With Redux?

```javascript
const reducer = (prev, action) => {
  if (!action) {
    return {
      message: 'foo',
    };
  }
  switch (action.type) {
    case 'message':
      return {
        message: action.message,
      };
  }
};
const changeMessage = (value) => {
  return {
    type: 'message',
    message: value,
  }
};

const store = createStore(reducer);

const manager = new AppManager('#app', new App({}, { store }));
manager.render();
```
