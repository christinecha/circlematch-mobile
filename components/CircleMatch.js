"use strict"

import React from 'react-native'
import {connect} from 'react-redux/native'
import MenuButton from './_MenuButton.js'
import Grid from './Grid.js'
import Timer from './Timer.js'
import _Tutorial from './_Tutorial.js'
import _NextLevel from './_NextLevel.js'
import _Menu from './_Menu.js'
import * as action from '../actions.js'
import * as helper from '../helpers.js'

const {
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated
} = React

let originalX = 0
let originalY = 0
let timerLaunched = false

class CircleMatch extends React.Component {

  componentDidUpdate() {
    const { dispatch, autoSolved, gameComplete, winner, level, modalIsOpen, gridWidth, timeLeft, timerIsRunning, score } = this.props
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
    const { dispatch, animations, cellData, gridWidth, modalIsOpen, winner, winningCombo } = this.props
    console.log('released, modal is ', modalIsOpen)
    if (modalIsOpen == false) {
      let Xdiff = evt.nativeEvent.pageX - originalX
      let Ydiff = evt.nativeEvent.pageY - originalY
      let move = helper.moveCode(gridWidth, Xdiff, Ydiff)
      dispatch(action.MOVE_CELLS(animations, gridWidth, cellData, move, winningCombo))
      originalX = 0
      originalY = 0
    }
  }

  moveCells(move) {
    const { dispatch, animations, cellData, gridWidth, winningCombo } = this.props
    dispatch(action.MOVE_CELLS(animations, gridWidth, cellData, move, winningCombo))
  }

  endTutorial() {
    const { dispatch } = this.props
    dispatch(action.END_TUTORIAL())
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
    const { dispatch, colorScheme } = this.props
    dispatch(action.RANDOMIZE_COLORS(colorScheme))
  }

  toggleBackgroundColor() {
    const { dispatch, colorScheme } = this.props
    dispatch(action.TOGGLE_BACKGROUND_COLOR(colorScheme))
  }

  autoSolve() {
    const { dispatch, autoSolved, cellData, gridWidth, level, score, timeLeft } = this.props
    this.closeMenu()
    dispatch(action.SOLVE_PUZZLE(cellData, level))
  }

  reset() {
    const { dispatch } = this.props
    dispatch(action.RESET())
  }

  render() {

    const {
      animations,
      autoSolved,
      colorScheme,
      cellData,
      gameComplete,
      gridWidth,
      level,
      menuIsOpen,
      menuView,
      modalIsOpen,
      score,
      timerIsRunning,
      timeLeft,
      translations,
      tutorialIsOn,
      winner,
      winningCombo
    } = this.props

    let styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(' + colorScheme.toJS().background + ')',
      }
    });

    return (
      <View style={styles.container}>
        <MenuButton
          colorScheme={colorScheme}
          level={level}
          score={score}
          timeLeft={timeLeft}
          openMenu={() => this.openMenu()} />
        <Modal
          animated={true}
          transparent={true}
          visible={tutorialIsOn} >
          <_Tutorial
            level={level}
            moveCells={(move) => this.moveCells(move)}
            endTutorial={() => this.endTutorial()}
            toggleBackgroundColor={() => this.toggleBackgroundColor()}
            reset={() => this.reset()} />
        </Modal>
        <Modal
          animated={true}
          transparent={true}
          visible={modalIsOpen} >
          <_NextLevel
            level={level}
            autoSolved={autoSolved}
            colorScheme={colorScheme}
            gameComplete={gameComplete}
            score={score}
            timeLeft={timeLeft}
            reset={() => this.reset()}
            closeModal={() => this.closeModal()} />
        </Modal>
        <Modal
          animated={true}
          transparent={true}
          visible={menuIsOpen} >
          <_Menu
            level={level}
            menuView={menuView}
            colorScheme={colorScheme}
            score={score}
            autoSolve={() => this.autoSolve()}
            reset={() => this.reset()}
            randomizeColor={() => this.randomizeColor()}
            toggleBackgroundColor={() => this.toggleBackgroundColor()}
            closeMenu={() => this.closeMenu()} />
        </Modal>
        <Grid
          animations={animations}
          gridWidth={gridWidth}
          cellData={cellData}
          colorScheme={colorScheme}
          translations={translations}
          onCellResponderGrant={(evt) => this.handleSwipeGrant(evt)}
          onCellResponderRelease={(evt) => this.handleSwipeRelease(evt)} />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    animations: state.get('animations'),
    autoSolved: state.get('autoSolved'),
    backgroundColor: state.get('backgroundColor'),
    colorScheme: state.get('colorScheme'),
    cellData: state.get('cellData'),
    gameComplete: state.get('gameComplete'),
    gridWidth: state.get('gridWidth'),
    level: state.get('level'),
    menuIsOpen: state.get('menuIsOpen'),
    menuView: state.get('menuView'),
    modalIsOpen: state.get('modalIsOpen'),
    score: state.get('score'),
    timerIsRunning: state.get('timerIsRunning'),
    timeLeft: state.get('timeLeft'),
    translations: state.get('translations'),
    tutorialIsOn: state.get('tutorialIsOn'),
    winningCombo: state.get('winningCombo'),
    winner: state.get('winner')
  }
}

export const CircleMatchContainer = connect(mapStateToProps)(CircleMatch);
