import React, { Component } from 'react';
import { Header, Image } from 'semantic-ui-react';
import axios from 'axios';
import { StaggeredMotion, spring, presets } from 'react-motion';

class Home extends Component {
  state = { x: 250, y: 300, followers: [], moved: [] }

  dropFollower = () => {
    let follower = this.state.followers[0];
    let followers = [...this.state.followers.slice(1), ...this.state.followers.length];
    this.setState({ followers, moved: [...this.state.moved, follower] });
  }
  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('dblclick', this.dropFollower);
    axios.get('/api/followers')
      .then( res => this.setState({ followers: res.data }) )
  }

  handleMouseMove = ({pageX: x, pageY: y}) => {
    this.setState({x, y});
  };

  getStyles = (prevStyles) => {
    // `prevStyles` is the interpolated value of the last tick
    const endValue = prevStyles.map((_, i) => {
      return i === 0
        ? this.state
        : {
          x: spring(prevStyles[i - 1].x, presets.gentle),
          y: spring(prevStyles[i - 1].y, presets.gentle),
        };
    });
    return endValue;
  };

  render() {
    if (this.state.followers.length) {
      return (
        <StaggeredMotion
          defaultStyles={this.state.followers.map(() => ({x: 0, y: 0}))}
          styles={this.getStyles}>
          { avatars => 
            <div style={{ width: '100%', height: '100%', position: 'absolute', background: '#EEE'}}>
              { avatars.map(({x,y}, i) => {
                let follower = this.state.followers[i];
                if (follower) {
                  return (
                    <div
                      key={i}
                      style={{
                        borderRadius: '99px',
                        backgroundColor: 'white',
                        width: '50px',
                        height: '50px',
                        border: '3px solid white',
                        position: 'absolute',
                        backgroundSize: '50px',
                        backgroundImage: `url(${this.state.followers[i].img})`,
                        WebkitTransform: `translate3d(${x - 50}px, ${y - 50}px, 0)`,
                        transform: `translate3d(${x - 50}px, ${y - 50}px, 0)`,
                        zIndex: avatars.length - i,
                      }}
                    />
                  )
                } else {
                  return null
                }
              }
              )}
            </div>
          }
        </StaggeredMotion>
      );
    } else {
      return null
    }
  };
}

export default Home;