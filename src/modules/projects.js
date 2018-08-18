import uuidv4 from "uuid/v4";
import Vue from "vue";

const Projects = {
  state: {
    active: {},
    pending: {
      a: {
        id: "a",
        name: "small",
        client: "foo",
        budget: 20000,
        time: 100,
        size: 0.1,
        complexity: 0.1,
        tasks: [],
        priority: 1,
        maxResources: {
          fed: 1,
          bed: 1,
          qa: 1
        },
        workDivision: {
          fed: 0.7,
          bed: 0.3
        }
      },
      b: {
        id: "b",
        name: "medium",
        client: "foo",
        budget: 200000,
        time: 100,
        size: 0.5,
        complexity: 0.5,
        tasks: [],
        priority: 1,
        maxResources: {
          fed: 1,
          bed: 1,
          qa: 1
        },
        workDivision: {
          fed: 0.7,
          bed: 0.3
        }
      },
      c: {
        id: "c",
        name: "large",
        client: "foo",
        budget: 700000,
        time: 100,
        size: 0.9,
        complexity: 0.9,
        tasks: [],
        priority: 1,
        maxResources: {
          fed: 1,
          bed: 1,
          qa: 1
        },
        workDivision: {
          fed: 0.7,
          bed: 0.3
        }
      }
    },
    done: {}
  },
  mutations: {
    addProject(state, project) {
      state.pending[project.id] = project;
    },
    startProject(state, id) {
      Vue.set(state.active, id, state.pending[id]);
      Vue.delete(state.pending, id);
    },
    allocateTasks(state, { tasks, id }) {
      state.pending[id].tasks = tasks;
    },
    completeProject(state, id) {
      Vue.set(state.done, id, state.active[id]);
      Vue.delete(state.active, id);
    }
  },
  actions: {
    addProject(context, project) {
      context.commit("addProject", project);
    },
    startProject(context, id) {
      context.commit("startProject", id);
      const project = context.getters.activeProjects[id];
      context.dispatch("addTasks", project.tasks);
      context.dispatch("addFunds", project.budget / 2);
    },
    completeProject(context, id) {
      context.commit("completeProject", id);
      const project = context.getters.doneProjects[id];
      context.dispatch("addFunds", project.budget / 2);
    },
    splitIntoTasks(context, id) {
      const project = context.getters.getPendingByID(id);
      const taskCount = Math.ceil(
        Math.pow(project.size * 11, 1 + project.complexity)
      );
      const tasks = Array(taskCount)
        .fill()
        .map(i => {
          return {
            name: `${project.client} - ${project.name} - ${i}`,
            project: project.id,
            id: uuidv4(),
            status: "ready",
            complexity: Math.ceil(project.complexity * Math.random() * 10) / 10,
            progress: 0,
            type: "arch",
            bugs: 0,
            producesTasks: [
              {
                type: "fed",
                count: Math.ceil(project.workDivision.fed),
                proportion: 0.8
              },
              {
                type: "fed",
                count: Math.ceil(project.workDivision.fed * 1.5),
                proportion: 0.4
              },
              {
                type: "fed",
                count: Math.ceil(project.workDivision.fed * 2),
                proportion: 0.2
              },
              {
                type: "bed",
                count: Math.ceil(project.workDivision.bed),
                proportion: 0.8
              },
              {
                type: "bed",
                count: Math.ceil(project.workDivision.bed * 1.5),
                proportion: 0.4
              },
              {
                type: "bed",
                count: Math.ceil(project.workDivision.fed * 2),
                proportion: 0.2
              }
            ]
          };
        });
      context.commit("allocateTasks", { tasks, id });
    }
  },
  getters: {
    pendingProjects: state => {
      return state.pending;
    },
    activeProjects: state => {
      return state.active;
    },
    doneProjects: state => {
      return state.done;
    },
    getPendingByID: (_, getters) => id => getters.pendingProjects[id]
  }
};

export default Projects;
