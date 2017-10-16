# react-vr-walk
Walk around your ReactVr app with WASD!

# Example:

```javascript
import React from 'react';
import {
  AppRegistry,
  Text,
  View,
} from 'react-vr';
import Walk from 'react-vr-walk'

class App extends React.Component {
  render() {
    return(
      <Walk panoSource={asset('chess-world.jpg')}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Text>Hey!</Text>
        </View>
      </Walk>
    )
  }
}
AppRegistry.registerComponent('App', () => App);

```
