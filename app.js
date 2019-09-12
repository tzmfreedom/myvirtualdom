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
    return `<div>
  <if c="this.state.text.length === 0">
    <p>blank</p>
  </if>
  <if c="this.state.text.length !== 0">
    <p>{this.state.text}</p>
  </if>
  <ul>
    <for records="{this.state.records}" var="record">
      <li>{record}</li>
    </for>
  </ul>
  <p>{this.getStore().getState().message + '!!'}</p>
  <input type="text" value="{this.state.text}" oninput="{this.onChangeText.bind(this)}"/>
  <Foo text="{this.state.text}"/>
</div>`
  }
}

class Foo extends Base {
  render() {
    return `<div>{this.props.text}</div>`;
  }
}
