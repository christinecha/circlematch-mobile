"use strict"

import React from 'react-native'
import Cell from './Cell.js'

const {
  StyleSheet,
  View,
  Text
} = React


class Grid extends React.Component {

  getCells() {
    const { cellData, cellColors, translations, onCellResponderGrant, onCellResponderMove, onCellResponderRelease } = this.props
    let cellSize = 60
    return cellData.toJS().map((cell, i) => {
      return (
        <Cell
          color={cellColors.toJS()[cell]}
          cellSize={cellSize}
          position={cell}
          borderWidth={5}
          index={i}
          key={i}
          translateX={translations.toJS()[i].translateX}
          translateY={translations.toJS()[i].translateY}
          onCellResponderGrant={(evt, index) => onCellResponderGrant(evt, index)}
          onCellResponderMove={(evt, index) => onCellResponderMove(evt, index)}
          onCellResponderRelease={(evt, index) => onCellResponderRelease(evt, index)} />
      )
    })
  }

  render() {
    const { gridWidth, cellData, cellColors, animation } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          circlematch
        </Text>
        <View style={styles.grid}>
          {this.getCells()}
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  grid: {
    width: 200,
    height: 200,
    backgroundColor: '#eee',
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default Grid
