import React, { Component } from 'react';
import {
  Scene,
  Animated,
  Pano,
	VrHeadModel
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
    const { speed = 1 } = this.props;
		let headModel = VrHeadModel.rotation()[1];
		let angle = Math.abs(90 - Math.abs(headModel)); // get complimentary angle
    switch (position) {
      case DIRECTION.FORWARD:
				if(Math.abs(headModel) < 90) {
					//z is q1 or q2, move in forward direction, negative.
					this.positionZ = this.positionZ - (speed * Math.sin(angle * Math.PI / 180));
					this.positionPZ = this.positionZ;
					this.moveZ(null, { dz: this.positionZ });
					this.movePZ(null, { dz: this.positionPZ });
				}
				else if(Math.abs(headModel) > 90) { //if positive
					//z is q3 or q4, move in reverse direction, positive.
					this.positionZ = this.positionZ + (speed * Math.sin(angle * Math.PI / 180));
					this.positionPZ = this.positionZ;
					this.moveZ(null, { dz: this.positionZ });
					this.movePZ(null, { dz: this.positionPZ });
				}

				if(headModel > 0) { //if facing left
					this.positionX = this.positionX - (speed * Math.cos(Math.abs(angle) * Math.PI / 180));
					this.moveX(null, { dx: this.positionX });
				}
				else if(headModel < 0) { //if facing right
					this.positionX = this.positionX + (speed * Math.cos(Math.abs(angle) * Math.PI / 180));
					this.moveX(null, { dx: this.positionX });
				}
        break;
      case DIRECTION.RIGHT:
				let rightAngle = Math.abs(90 - Math.abs(headModel - 90)); //subtract 90 to pivot the headset right.
				//the rest is same as fwd
				if(Math.abs(headModel - 90) < 90) {
					this.positionZ = this.positionZ - (speed * Math.sin(rightAngle * Math.PI / 180));
					this.positionPZ = this.positionZ;
					this.moveZ(null, { dz: this.positionZ });
					this.movePZ(null, { dz: this.positionPZ });
				}
				else if(Math.abs(headModel - 90) > 90) {
					this.positionZ = this.positionZ + (speed * Math.sin(rightAngle * Math.PI / 180));
					this.positionPZ = this.positionZ;
					this.moveZ(null, { dz: this.positionZ });
					this.movePZ(null, { dz: this.positionPZ });
				}

				if(headModel - 90 > 0) {
					this.positionX = this.positionX - (speed * Math.cos(Math.abs(rightAngle) * Math.PI / 180));
					this.moveX(null, { dx: this.positionX });
				}
				else if(headModel - 90 < 0) {
					this.positionX = this.positionX + (speed * Math.cos(Math.abs(rightAngle) * Math.PI / 180));
					this.moveX(null, { dx: this.positionX });
				}

        break;
      case DIRECTION.BACKWARD:
				if(Math.abs(headModel) < 90) {
					this.positionZ = this.positionZ + (speed * Math.sin(angle * Math.PI / 180));
					this.positionPZ = this.positionZ;
					this.moveZ(null, { dz: this.positionZ });
					this.movePZ(null, { dz: this.positionPZ });
				}
				else if(Math.abs(headModel) > 90) {
					this.positionZ = this.positionZ - (speed * Math.sin(angle * Math.PI / 180));
					this.positionPZ = this.positionZ;
					this.moveZ(null, { dz: this.positionZ });
					this.movePZ(null, { dz: this.positionPZ });
				}

				if(headModel > 0) {
					this.positionX = this.positionX + (speed * Math.cos(Math.abs(angle) * Math.PI / 180));
					this.moveX(null, { dx: this.positionX });
				}

				else if(headModel < 0) {
					this.positionX = this.positionX - (speed * Math.cos(Math.abs(angle) * Math.PI / 180));
					this.moveX(null, { dx: this.positionX });
				}
        break;
      case DIRECTION.LEFT:
				let leftAngle = Math.abs(90 - Math.abs(headModel + 90))//subtract 90 to pivot the headset right.
				//the rest is same as fwd
				if(Math.abs(headModel + 90) < 90) {
					this.positionZ = this.positionZ - (speed * Math.sin(leftAngle * Math.PI / 180));
					this.positionPZ = this.positionZ
					this.moveZ(null, { dz: this.positionZ });
					this.movePZ(null, { dz: this.positionPZ });
				}
				else if(Math.abs(headModel + 90) > 90) {
					this.positionZ = this.positionZ + (speed * Math.sin(leftAngle * Math.PI / 180));
					this.positionPZ = this.positionZ
					this.moveZ(null, { dz: this.positionZ });
					this.movePZ(null, { dz: this.positionPZ });
				}

				if(headModel + 90 > 0) {
					this.positionX = this.positionX - (speed * Math.cos(Math.abs(leftAngle) * Math.PI / 180));
					this.moveX(null, { dx: this.positionX });
				}
				else if(headModel + 90 < 0) {
					this.positionX = this.positionX + (speed * Math.cos(Math.abs(leftAngle) * Math.PI / 180));
					this.moveX(null, { dx: this.positionX });
				}
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
