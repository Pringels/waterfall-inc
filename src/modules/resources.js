const Resources = {
  state: {
    staff: [],
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
      task.status = "pending";
    },
    removeTask(state, { resource }) {
      resource.activeTask = null;
    },
    doWorkOnTask(state, { resource, task }) {
      const effectiveness = 1 + resource.skill - task.complexity;
      const workDone = Math.ceil(
        effectiveness * effectiveness * effectiveness * 10
      );
      if (task.progress + workDone > 100) {
        task.progress = 100;
      } else {
        task.progress += workDone;
      }
      const introducedBug = Math.random() + effectiveness < 1.3;
      if (introducedBug && state.canProduceBugs[resource.role]) {
        task.bugs += 1;
      }
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
          task = doableTasks[doableTasks.length - 1];
        }
        if (task) {
          context.commit("allocateTask", { resource, task });
          context.dispatch("doWork", { resource, task });
        }
      }
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
