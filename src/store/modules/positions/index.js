import Axios from "axios";

const state = {
  positionsList: {
    isLoading: false,
    value: []
  },
  createDialog: false,
  deleteDialog: false,
  editedItem: { id: 0, name: "", salary: 0, workingHoursPerWeek: 0 },
  defaultItem: { id: 0, name: "", salary: 0, workingHoursPerWeek: 0 }
};

const getters = {};

const mutations = {
  setPositionsList(state, positionsList) {
    state.positionsList.value = positionsList;
    state.positionsList.isLoading = false;
  },
  setIsLoadingPositions(state, { isLoading, fieldName }) {
    state[fieldName].isLoading = isLoading;
  },
  setDeletePositionDialog(state, value) {
    state.deleteDialog = value;
  },
  setCreatePositionDialog(state, value) {
    state.createDialog = value;
  },
  setEditedPositionItem(state, editedItem) {
    state.editedItem = Object.assign({}, editedItem);
  }
};

const actions = {
  async fetchPositionsList(context) {
    context.commit("setIsLoadingPositions", {
      isLoading: true,
      fieldName: "positionsList"
    });
    return new Promise((resolve, reject) => {
      Axios.get(`http://localhost:5000/positions`)
        .then(response => {
          context.commit("setPositionsList", response.data.result);
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  async deletePosition(context, { id }) {
    return new Promise((resolve, reject) => {
      Axios.delete(`http://localhost:5000/position/${id}`)
        .then(() => {
          context.dispatch("fetchPositionsList");
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  async putPosition(context, { id, data }) {
    return new Promise((resolve, reject) => {
      Axios.put(`http://localhost:5000/position/${id}`, data)
        .then(() => {
          context.dispatch("fetchPositionsList");
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  async postPosition(context, { data }) {
    return new Promise((resolve, reject) => {
      Axios.post(`http://localhost:5000/position/`, data)
        .then(() => {
          context.dispatch("fetchPositionsList");
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  async setDeletePositionDialog(context, { value }) {
    context.commit("setDeletePositionDialog", value);
  },
  async setCreatePositionDialog(context, { value }) {
    context.commit("setCreatePositionDialog", value);
  },
  async setEditedPositionItem(context, { item }) {
    context.commit("setEditedPositionItem", item);
  }
};

export default { state, getters, mutations, actions };
