import Vue from "vue";
import Vuex from "vuex";

import uuidv4 from "uuid/v4";

Vue.use(Vuex);

const Resources = {
  state: {
    fed: [
      {
        id: 1,
        name: "Peter",
        activeTask: null
      }
    ]
  },
  mutations: {
    add(resource) {
      state.fed.push(resource);
    },
    allocateTask(state, { resource, task }) {
      resource.activeTask = task.id;
      task.status = "in progress";
    },
    completeTask(state, { resource }) {
      resource.activeTask = null;
    }
  },
  actions: {
    addResource(context, resource) {
      context.commit("addResource", resource);
    },

    allocateTask(context, resource) {
      if (!resource.activeTask) {
        const task =
          context.getters.readyTasks[context.getters.readyTasks.length - 1];
        if (task) {
          context.commit("allocateTask", { resource, task });
          setTimeout(() => {
            context.commit("completeTask", { resource, task });
          }, 1000);
        }
      }
    }
  },
  getters: {
    resources: state => {
      return state.fed;
    }
  }
};

const Tasks = {
  state: {
    items: [
      {
        name: "some task",
        id: 1,
        status: "ready"
      },
      {
        name: "some task 2",
        id: 2,
        status: "ready"
      }
    ]
  },
  mutations: {
    addTask(state) {
      state.items.push({
        id: uuidv4(),
        name: "some task",
        status: "ready"
      });
    },

    completeTask(state, { task }) {
      task.status = "complete";
    }
  },
  actions: {
    markAsComplete(id) {
      context.commit("completeTask", id);
    },
    addTask({ commit }) {
      commit("addTask");
    }
  },
  getters: {
    tasks: state => {
      return state.items;
    },
    readyTasks: state => {
      return state.items.filter(item => item.status === "ready");
    }
  }
};

const store = new Vuex.Store({
  modules: {
    resources: Resources,
    tasks: Tasks
  }
});

export default store;
