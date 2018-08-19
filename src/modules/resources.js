const Resources = {
  state: {
    staff: [
      {
        id: 1,
        activeTask: null,
        role: "fed",
        skill: 0.9,
        familiarity: 0,
        project: "b",
        name: "Good FED",
        cost: 2000
      },
      {
        id: 2,
        activeTask: null,
        role: "qa",
        project: "b",
        familiarity: 0,
        skill: 0.6,
        name: "Some QA",
        cost: 2000
      },
      {
        id: 3,
        activeTask: null,
        role: "bed",
        skill: 0.6,
        familiarity: 0,
        project: "b",
        name: "Some BED",
        cost: 2000
      },
      {
        id: 5,
        activeTask: null,
        role: "fed",
        skill: 0.1,
        familiarity: 0,
        project: "b",
        name: "Bad FED",
        cost: 2000
      },
      {
        id: 4,
        activeTask: null,
        role: "arch",
        skill: 0.6,
        familiarity: 0,
        project: "b",
        name: "Some Arch",
        cost: 2000
      }
    ],
    canProduceBugs: {
      fed: true,
      bed: true,
      qa: false,
      arch: false
    }
  },
  mutations: {
    add(state, resource) {
      state.staff.push(resource);
    },
    allocateTask(state, { resource, task }) {
      resource.activeTask = task.id;
    },
    removeTask(state, { resource }) {
      resource.activeTask = null;
    },
    doWorkOnTask(state, { resource, task }) {
      const effectiveness = 1 + resource.skill - task.complexity;
      resource.familiarity += Math.round(resource.skill * 10) / 100;
      if (resource.familiarity > 1) {
        resource.familiarity = 1;
      }
      const workDone = Math.ceil(
        effectiveness * effectiveness * effectiveness * 10
      );
      if (task.progress + workDone > 100) {
        task.progress = 100;
      } else {
        task.progress += workDone;
      }
      const introducedBug =
        Math.random() + effectiveness * resource.familiarity < 1.3;
      if (introducedBug && state.canProduceBugs[resource.role]) {
        task.bugs += 1;
      }
    },
    assignToProject(state, { projectId, resource }) {
      resource.project = projectId;
    }
  },
  actions: {
    addResource(context, resource) {
      context.commit("add", resource);
    },

    startWorkDay(context) {
      context.getters.resources.forEach(resource => {
        if (resource.activeTask) {
          const task = context.getters.taskById(resource.activeTask);
          context.dispatch("doWork", { resource, task });
        } else {
          context.dispatch("allocateTask", resource);
        }
      });
    },

    allocateTask(context, resource) {
      if (!resource.activeTask) {
        let task;
        const doableTasks = context.getters.readyTasksByType(resource.role);
        if (doableTasks.length) {
          task = doableTasks.find(task => task.project === resource.project);
        }
        if (task) {
          context.commit("startTask", task);
          context.commit("allocateTask", { resource, task });
          context.dispatch("doWork", { resource, task });
        }
      }
    },

    assignToProject(context, { projectId, resource }) {
      context.commit("assignToProject", { projectId, resource });
      context.dispatch("allocateTask", resource);
    },

    doWork(context, { resource, task }) {
      if (context.getters.timeInfo.active && !context.getters.timeInfo.paused) {
        setTimeout(() => {
          if (task.status !== "done") {
            if (task.progress >= 100) {
              context.dispatch("markAsComplete", { task });
              context.commit("removeTask", { resource });
              if (task.producesTasks && task.producesTasks.length) {
                task.producesTasks.forEach(followUpTask => {
                  Array(followUpTask.count)
                    .fill()
                    .forEach((_, i) => {
                      let producesTasks = [];
                      const producesTaskType = context.getters.shouldProduce(
                        followUpTask.type
                      );

                      if (producesTaskType) {
                        producesTasks = [
                          {
                            type: producesTaskType,
                            count: Math.ceil(task.complexity * 2),
                            proportion: task.complexity / 2
                          }
                        ];
                      }

                      if (task.bugs) {
                        producesTasks = [
                          ...producesTasks,
                          ...Array(task.bugs)
                            .fill()
                            .map(_ => ({
                              type: task.type,
                              count: 1,
                              proportion: Math.ceil(Math.random() * 10) / 10
                            }))
                        ];
                      }
                      context.dispatch("addTask", {
                        type: followUpTask.type,
                        project: task.project,
                        name: "Some task for: " + followUpTask.type,
                        complexity: task.complexity * followUpTask.proportion,
                        producesTasks
                      });
                    });
                });
              }
              context.dispatch("allocateTask", resource);
            } else {
              context.commit("doWorkOnTask", { resource, task });
              context.dispatch("doWork", { resource, task });
            }
          }
        }, context.getters.delay);
      }
    }
  },
  getters: {
    resources: state => {
      return state.staff;
    }
  }
};

export default Resources;
