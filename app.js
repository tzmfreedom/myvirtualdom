class App extends Base {
  onMounted() {
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
      h('p', {}, [t(this.getStore().getState().message)]),
      h('input', {
        type: 'text',
        onkeyup: ((e) => {
          this.setState({
            text: e.target.value
          })
          this.getStore().dispatch(changeMessage(`${e.target.value}:hoge`))
        }).bind(this),
        value: this.state.text
      }, []),
      (new Foo({ text: this.state.text }, this.context)).render()
    ])
  }
}

class Foo extends Base {
  render() {
    return h('div', [], [t(this.props.text)])
  }
}
