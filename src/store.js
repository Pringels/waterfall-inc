import Vue from 'vue';
import Vuex from 'vuex';

import Company from './modules/company';
import Projects from './modules/projects';
import Resources from './modules/resources';
import Tasks from './modules/tasks';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentDay: 0,
    elapsedDays: 0,
    dayActive: false,
    currentHour: 0,
    dayLength: 8,
    speed: 5,
    cycle: 0,
    autoStartDay: true,
    paused: false
  },
  mutations: {
    startDay(state) {
      state.dayActive = true;
      state.currentDay += 1;
    },
    tickHour(state) {
      state.currentHour += 1;
    },
    endDay(state) {
      state.dayActive = false;
      state.currentHour = 0;
      state.elapsedDays += 1;
    },
    endCycle(state) {
      state.cycle += 1;
    },
    setSpeed(state, speed) {
      state.speed = speed;
    },
    setAutoStartDay(state, auto) {
      state.autoStartDay = auto;
    },
    setPause(state, pause) {
      state.paused = pause;
    }
  },
  actions: {
    startDay({ commit, dispatch, state }) {
      if (!state.dayActive) {
        commit("startDay");
        dispatch("tickHour");
        dispatch("startWorkDay");
      } else {
        dispatch("tickHour");
        dispatch("startWorkDay");
      }
    },
    tickHour({ state, commit, dispatch, getters }) {
      if (state.paused === false) {
        setTimeout(() => {
          if (state.currentHour < state.dayLength) {
            commit("tickHour");
            dispatch("tickHour");
          } else {
            dispatch("endDay");
          }
        }, getters.delay);
      }
    },
    endDay({ commit, state, dispatch }) {
      commit("endDay");
      if (state.autoStartDay) {
        dispatch("startDay");
      }
      if (state.elapsedDays % 20 === 0) {
        dispatch("endCycle");
      }
    },
    endCycle({ commit, dispatch }) {
      commit("endCycle");
      dispatch("subtractResourceSalaries");
    },
    setSpeed({ commit }, speed) {
      commit("setSpeed", speed);
    },
    setAuto({ commit }, auto) {
      commit("setAutoStartDay", auto);
    },
    setPause({ commit, dispatch, state }, pause) {
      commit("setPause", pause);
      if (pause === false && state.dayActive) {
        dispatch("startDay");
      }
    }
  },
  getters: {
    timeInfo(state) {
      return {
        hour: state.currentHour,
        elapsedDays: state.elapsedDays,
        day: state.currentDay,
        active: state.dayActive,
        length: state.dayLength,
        speed: state.speed,
        paused: state.paused,
        autoStartDay: state.autoStartDay
      };
    },
    delay(state) {
      return 1000 / (state.speed * state.speed);
    }
  },
  modules: {
    resources: Resources,
    tasks: Tasks,
    company: Company,
    projects: Projects
  }
});

export default store;
