"use strict"

import React from 'react-native'
import {connect} from 'react-redux/native'
import Hamburger from './_Hamburger.js'
import Grid from './Grid.js'
import InfoBar from './InfoBar.js'
// import Toolbar from './Toolbar.jsx'
import _NextLevel from './_NextLevel.js'
import _Menu from './_Menu.js'
import * as action from '../actions.js'
import * as helper from '../helpers.js'

const {
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableOpacity
} = React

let originalX = 0
let originalY = 0
let timerLaunched = false

class CircleMatch extends React.Component {

  componentDidUpdate() {
    const { dispatch, autoSolved, winner, level, modalIsOpen, gridWidth, timeLeft, timerIsRunning, score } = this.props
    if (winner && !modalIsOpen) {
      dispatch(action.OPEN_MODAL())
    } else if (timerIsRunning == false && timeLeft == 60 && timerLaunched == false) {
      this.runTimer()
    }
  }

  runTimer() {
    timerLaunched = true
    let timer = setInterval(() => {
      const { dispatch, timeLeft, timerIsRunning, winner, menuIsOpen, modalIsOpen } = this.props
      if (winner == true || parseInt(timeLeft) <= 0 || modalIsOpen == true) {
        clearInterval(timer)
        timerLaunched = false
      } else if (!timerIsRunning && menuIsOpen) {
        //do nothing
      } else {
        let newTimeLeft = parseInt(timeLeft) - 1
        dispatch(action.TIMER(newTimeLeft))
      }
    }, 1000)
  }

  closeModal() {
    const { dispatch, autoSolved, gridWidth, level, score, timeLeft } = this.props
    dispatch(action.SET_LEVEL(level + 1, gridWidth, score, timeLeft, autoSolved))
    dispatch(action.CLOSE_MODAL())
  }

  handleSwipeGrant(evt) {
    console.log('touched')
    originalX = evt.nativeEvent.pageX
    originalY = evt.nativeEvent.pageY
  }

  handleSwipeRelease(evt) {
    const { dispatch, cellData, gridWidth, modalIsOpen, translations, winner, winningCombo } = this.props
    console.log('released, modal is ', modalIsOpen)
    if (modalIsOpen == false) {
      let Xdiff = evt.nativeEvent.pageX - originalX
      let Ydiff = evt.nativeEvent.pageY - originalY
      let move = helper.moveCode(gridWidth, Xdiff, Ydiff)
      dispatch(action.MOVE_CELLS(gridWidth, cellData, move, winningCombo))
      originalX = 0
      originalY = 0
    }
  }

  openMenu() {
    const { dispatch } = this.props
    dispatch(action.OPEN_MENU())
  }

  closeMenu() {
    const { dispatch } = this.props
    dispatch(action.CLOSE_MENU())
  }

  randomizeColor() {
    const { dispatch } = this.props
    dispatch(action.RANDOMIZE_COLORS())
  }

  render() {

    const {
      autoSolved,
      cellColors,
      cellData,
      gridWidth,
      level,
      menuIsOpen,
      menuView,
      modalIsOpen,
      score,
      timerIsRunning,
      timeLeft,
      translations,
      winner,
      winningCombo
    } = this.props

    return (
      <View style={styles.container}>

        <Hamburger
          openMenu={() => this.openMenu()} />
        <Modal
          animated={true}
          transparent={true}
          visible={modalIsOpen} >
          <_NextLevel
            level={level}
            autoSolved={autoSolved}
            timeLeft={timeLeft}
            closeModal={() => this.closeModal()} />
        </Modal>
        <Modal
          animated={true}
          transparent={true}
          visible={menuIsOpen} >
          <_Menu
            level={level}
            menuView={menuView}
            cellColors={cellColors}
            randomizeColor={() => this.randomizeColor()}
            closeMenu={() => this.closeMenu()} />
        </Modal>
        <InfoBar
          gridWidth={gridWidth}
          cellColors={cellColors}
          level={level}
          winningCombo={winningCombo}
          score={score}
          timeLeft={timeLeft}
          onSolveButtonClick = {() => this.solvePuzzle()} />
        <Text style={styles.timer}>
          00:{timeLeft}
        </Text>
        <Grid
          gridWidth={gridWidth}
          cellData={cellData}
          cellColors={cellColors}
          translations={translations}
          onCellResponderGrant={(evt) => this.handleSwipeGrant(evt)}
          onCellResponderRelease={(evt) => this.handleSwipeRelease(evt)} />
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f2',
  }
});

function mapStateToProps(state) {
  return {
    autoSolved: state.get('autoSolved'),
    cellColors: state.get('cellColors'),
    cellData: state.get('cellData'),
    gridWidth: state.get('gridWidth'),
    level: state.get('level'),
    menuIsOpen: state.get('menuIsOpen'),
    menuView: state.get('menuView'),
    modalIsOpen: state.get('modalIsOpen'),
    score: state.get('score'),
    timerIsRunning: state.get('timerIsRunning'),
    timeLeft: state.get('timeLeft'),
    translations: state.get('translations'),
    winningCombo: state.get('winningCombo'),
    winner: state.get('winner')
  }
}

export const CircleMatchContainer = connect(mapStateToProps)(CircleMatch);
