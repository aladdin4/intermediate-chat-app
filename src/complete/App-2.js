import React from "react";
import uuid from "uuid";
import { createStore } from "redux";

function reducer(state, action) {
  //action is an object with all the properties that reducer() needs.
  if (action.type === "ADD_MESSAGE") {
    //the msg is an object that contains many properties about the text, time and id of msg
    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      //creating a unique id and saving it inside the object msg itself
      id: uuid.v4(),
    };
    return {
      //an array of objects
      messages: state.messages.concat(newMessage),
    };
  } else if (action.type === "DELETE_MESSAGE") {
    return {
      //filter not slice(), because we don't use index here.
      messages: state.messages.filter((m) => {
        m.id !== action.id;
      }),
    };
  } else {
    return state;
  }
}

const initialState = { messages: [] };

const store = createStore(reducer, initialState);

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const messages = store.getState().messages;

    return (
      <div className="ui segment">
        <MessageView messages={messages} />
        <MessageInput />
      </div>
    );
  }
}

class MessageInput extends React.Component {
  state = {
    value: "",
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSubmit = () => {
    store.dispatch({
      type: "ADD_MESSAGE",
      text: this.state.value,
    });
    this.setState({
      value: "",
    });
  };

  render() {
    return (
      <div className="ui input">
        <input onChange={this.onChange} value={this.state.value} type="text" />
        <button
          onClick={this.handleSubmit}
          className="ui primary button"
          type="submit"
        >
          Submit
        </button>
      </div>
    );
  }
}

class MessageView extends React.Component {
  handleClick = (id) => {
    store.dispatch({
      type: "DELETE_MESSAGE",
      id: id,
    });
  };

  render() {
    const messages = this.props.messages.map((message, index) => (
      <div
        className="comment"
        key={index}
        onClick={() => this.handleClick(message.id)} // Use `id`
      >
        <div className="text">
          {" "}
          {/* Wrap message data in `div` */}
          {message.text}
          <span className="metadata">@{message.timestamp}</span>
        </div>
      </div>
    ));
    return (
      <div className="ui center aligned basic segment">
        <div className="ui comments">{messages}</div>
      </div>
    );
  }
}

export default App;
