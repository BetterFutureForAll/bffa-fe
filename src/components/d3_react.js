import React from "react";

class D3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      d3React: new d3React()
    };
    this.getd3ReactState = this.getd3ReactState.bind(this);
  }

  getd3ReactState() {
    // Using props and state, calculate the d3React state
    return ({
      data: {
        x: 0,
        y: 0,
        width: 42,
        height: 17,
        fill: 'red'
      }
    });
  }

  componentDidMount() {
    var props = {
      width: this._d3Div.clientWidth,
      height: this._d3Div.clientHeight
    };
    var state = this.getd3ReactState();
    this.state.d3React.create(this._d3Div, props, state);
  }

  componentDidUpdate(prevProps, prevState) {
    var state = this.getd3ReactState();
    this.state.d3React.update(this._d3Div, state);
  }

  componentWillUnmount() {
    this.state.d3React.destroy(this._d3Div);
  }

  render() {
    return (
      <div>
        <h1>{this.props.message}</h1>
        <div className="d3Component" ref={(component) => { this._d3Div = component; } } />
      </div>
    );
  }
}

class d3React {
  constructor() {
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.destroy  = this.destroy.bind(this);
    this._drawComponent = this._drawComponent.bind(this);
  }

  create(element, props, state) {
    console.log('d3React create');
    var svg = d3.select(element).append('svg')
      .attr('width', props.width)
      .attr('height', props.height);

    this.update(element, state);
  }

  update(element, state) {
    console.log('d3React update');
    this._drawComponent(element, state.data);
  }

  destroy(element) {
    console.log('d3React destroy');
  }

  _drawComponent(element, data) {
    // perform all drawing on the element here
    var svg = d3.select(element).select('svg');

    svg.append('rect')
      .attr('x', data.x)
      .attr('y', data.y)
      .attr('width', data.width)
      .attr('height', data.height)
      .attr('fill', data.fill);
  }
}

ReactDOM.render(<D3 message="Hello, D3.js and React!"/>, document.getElementById('app'));