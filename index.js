import React, { Component } from 'react';
import {
  Scene,
  Animated,
  Pano
} from 'react-vr';
import PropTypes from 'prop-types';

const AnimatedScene = Animated.createAnimatedComponent(Scene);
const AnimatedPano = Animated.createAnimatedComponent(Pano);

const DIRECTION = {
  FORWARD: 'FORWARD',
  BACKWARD: 'BACKWARD',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT'
};

export default class Walk extends Component {
  static get propTypes() {
    return {
      starting: PropTypes.number,
      startingPano: PropTypes.number,
      speed: PropTypes.number,
      children: PropTypes.node.isRequired,
      panoSource: PropTypes.any.isRequired,
    };
  }

  static get defaultProps() {
    return {
      starting: 0,
      startingPano: 0,
      speed: 0.1,
    };
  }

  constructor(props) {
    super(props);
    const { starting = 0, startingPano = 0 } = props;

    this.state = {
      x: new Animated.Value(0),
      z: new Animated.Value(starting),
      pz: new Animated.Value(startingPano),
    };

    this.moveZ = Animated.event([
      null, { dz: this.state.z },
    ]);

    this.movePZ = Animated.event([
      null, { dz: this.state.pz },
    ]);

    this.moveX = Animated.event([
      null, { dx: this.state.x },
    ]);

    this.positionZ = starting;
    this.positionPZ = startingPano;
    this.positionX = 0;
  }

  onInput = (e) => {
    const event = e.nativeEvent.inputEvent;

    if (event.eventType === 'keydown') {
      console.log(event);
      switch (event.code) {
        case 'KeyW':
          this.walk(DIRECTION.FORWARD);
          break;
        case 'KeyA':
          this.walk(DIRECTION.LEFT);
          break;
        case 'KeyS':
          this.walk(DIRECTION.BACKWARD);
          break;
        case 'KeyD':
          this.walk(DIRECTION.RIGHT);
          break;
        default:
          break;
      }
    }
  }

  walk = (position) => {
    const { speed = 0.1 } = this.props;

    switch (position) {
      case DIRECTION.FORWARD:
        this.positionZ = this.positionZ - speed;
        this.positionPZ = this.positionPZ + (speed * 10);
        this.moveZ(null, { dz: this.positionZ });
        this.movePZ(null, { dz: this.positionPZ });
        break;
      case DIRECTION.RIGHT:
        this.positionX = this.positionX + speed;
        this.moveX(null, { dx: this.positionX });
        break;
      case DIRECTION.BACKWARD:
        this.positionZ = this.positionZ + speed;
        this.positionPZ = this.positionPZ - (speed * 10);
        this.moveZ(null, { dz: this.positionZ });
        this.movePZ(null, { dz: this.positionPZ });
        break;
      case DIRECTION.LEFT:
        this.positionX = this.positionX - speed;
        this.moveX(null, { dx: this.positionX });
        break;
      default:
        break;
    }
  }

  render() {
    const { panoSource, children } = this.props;
    return (
      <AnimatedScene
        onInput={this.onInput}
        style={{
          transform: [
            { translateX: this.state.x },
            { translateZ: this.state.z }
          ]
        }}
      >
        <AnimatedPano
          source={panoSource}
          style={{
            transform: [
              { translateZ: this.state.pz }
            ]
          }}
        />
        {children}
      </AnimatedScene>
    );
  }
}
