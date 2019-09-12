class App extends Base {
  constructor() {
    super({})
    this.state = {
      text: 0
    }
  }

  render() {
    return h('div', {}, [
      (this.state.text === '') ? (
        h('p', [], [t('blank')])
      ) : (
        h('p', {
          onclick: ((e) => {
            this.setState({
              text: this.state.text + 1
            })
          }).bind(this)
        }, [
          t(this.state.text)
        ])
      ),
      h('input', {
        type: 'text',
        onkeyup: ((e) => {
          this.setState({
            text: e.target.value
          })
        }).bind(this),
        value: this.state.text
      }, []),
      (new Foo({ text: this.state.text })).render()
    ])
  }
}

class Foo extends Base {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return h('div', [], [t(this.props.text)])
  }
}
