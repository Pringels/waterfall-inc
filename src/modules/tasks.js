import uuidv4 from "uuid/v4";
import Vue from "vue";

const Tasks = {
  state: {
    items: {
      ready: {},
      pending: {},
      done: {}
    },
    producers: {
      fed: "qa",
      bed: "qa"
    }
  },
  mutations: {
    addTask(state, task) {
      const id = uuidv4();
      Vue.set(state.items.ready, id, {
        id,
        status: "ready",
        progress: 0,
        bugs: 0,
        ...task
      });
    },

    completeTask(state, task) {
      task.status = "done";
      Vue.set(state.items.done, task.id, task);
      Vue.delete(state.items.pending, task.id);
    },

    startTask(state, task) {
      task.status = "pending";
      Vue.set(state.items.pending, task.id, task);
      Vue.delete(state.items.ready, task.id);
    }
  },
  actions: {
    markAsComplete({ commit, getters, dispatch }, { task }) {
      commit("completeTask", task);
      const projectId = task.project;
      if (!getters.inCompleteTasksByProjectId(projectId).length) {
        dispatch("completeProject", projectId);
      }
    },
    addTask({ commit }, task) {
      commit("addTask", task);
    },
    addTasks({ commit }, tasks) {
      tasks.forEach(task => commit("addTask", task));
    }
  },
  getters: {
    tasks: state => {
      return {
        ...state.items.ready,
        ...state.items.pending,
        ...state.items.done
      };
    },
    readyTasks: state => {
      return Object.values(state.items.ready);
    },
    readyTasksByType: (_, getters) => role =>
      getters.readyTasks.filter(task => task.type === role),
    pendingTasks: state => {
      return Object.values(state.items.pending);
    },
    doneTasks: state => {
      return Object.values(state.items.done);
    },
    inCompleteTasksByProjectId: state => id => {
      return Object.values({
        ...state.items.ready,
        ...state.items.pending
      }).filter(item => item.project === id);
    },
    taskById: (state, getters) => id => getters.tasks[id],
    shouldProduce: state => type => state.producers[type]
  }
};

export default Tasks;
