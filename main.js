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