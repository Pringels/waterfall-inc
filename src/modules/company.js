const Company = {
  state: {
    money: {
      funds: 10000
    }
  },
  mutations: {
    addFunds(state, amount) {
      state.money.funds += amount;
    },
    subtractFunds(state, amount) {
      state.money.funds -= amount;
    }
  },
  actions: {
    addFunds(context, amount) {
      context.commit("addFunds", amount);
    },
    subtractResourceSalaries(context) {
      const totalToSubtract = context.getters.resources
        .map(resource => resource.cost)
        .reduce((acc, curr) => acc + curr, 0);
      context.commit("subtractFunds", totalToSubtract);
    }
  },
  getters: {
    funds: state => {
      return state.money.funds;
    }
  }
};

export default Company;
