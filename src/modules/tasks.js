import uuidv4 from "uuid/v4";

const Tasks = {
  state: {
    items: [
      // {
      //   name: "some MEDIUM task",
      //   id: 1,
      //   status: "ready",
      //   complexity: 0.5,
      //   progress: 0,
      //   type: "fed",
      //   bugs: 0,
      //   producesTasks: [{ type: "qa", count: 1, proportion: 0.3 }]
      // },
      // {
      //   name: "some EASY task",
      //   id: 2,
      //   status: "ready",
      //   complexity: 0.1,
      //   progress: 0,
      //   type: "fed",
      //   bugs: 0,
      //   producesTasks: [{ type: "qa", count: 1, proportion: 0.1 }]
      // },
      // {
      //   name: "some HARD task",
      //   id: 3,
      //   status: "ready",
      //   complexity: 0.5,
      //   progress: 0,
      //   type: "fed",
      //   bugs: 0,
      //   producesTasks: [{ type: "qa", count: 1, proportion: 0.3 }]
      // },
      // {
      //   name: "Atchtecture!",
      //   id: 3,
      //   status: "ready",
      //   complexity: 0.9,
      //   progress: 0,
      //   type: "arch",
      //   bugs: 0,
      //   producesTasks: [
      //     { type: "fed", count: 1, proportion: 0.8 },
      //     { type: "fed", count: 4, proportion: 0.5 },
      //     { type: "fed", count: 6, proportion: 0.2 }
      //   ]
      // }
    ],
    producers: {
      fed: "qa",
      bed: "qa"
    }
  },
  mutations: {
    addTask(state, task) {
      state.items.push({
        id: uuidv4(),
        status: "ready",
        progress: 0,
        bugs: 0,
        ...task
      });
    },

    addTasks(state, tasks) {
      state.items = [...state.items, ...tasks];
    },

    completeTask(state, task) {
      task.status = "done";
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
      commit("addTasks", tasks);
    }
  },
  getters: {
    tasks: state => {
      return state.items;
    },
    readyTasks: state => {
      return state.items.filter(item => item.status === "ready");
    },
    readyTasksByType: (_, getters) => role =>
      getters.readyTasks.filter(task => task.type === role),
    pendingTasks: state => {
      return state.items.filter(item => item.status === "pending");
    },
    doneTasks: state => {
      return state.items.filter(item => item.status === "done");
    },
    inCompleteTasksByProjectId: state => id => {
      return state.items.filter(
        item => item.status != "done" && item.project === id
      );
    },
    taskById: state => id => state.items.find(item => item.id === id),
    shouldProduce: state => type => state.producers[type]
  }
};

export default Tasks;
