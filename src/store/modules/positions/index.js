import Axios from "axios";

const state = {
  positionsList: {
    isLoading: false,
    value: []
  },
  departmentsList: {
    isLoading: false,
    value: []
  },
  createDialog: false,
  createDepartDialog: false,
  deleteDialog: false,
  deleteDepartDialog: false,
  editedItem: { id: 0, name: "", salary: 0, workingHoursPerWeek: 0 },
  editedDepartItem: { id: 0, name: "" },
  defaultItem: { id: 0, name: "", salary: 0, workingHoursPerWeek: 0 },
  defaultDepartItem: { id: 0, name: "" }
};

const getters = {};

const mutations = {
  setPositionsList(state, positionsList) {
    state.positionsList.value = positionsList;
    state.positionsList.isLoading = false;
  },
  setDepartmentsList(state, departmentsList) {
    state.departmentsList.value = departmentsList;
    state.departmentsList.isLoading = false;
  },
  setIsLoadingPositions(state, { isLoading, fieldName }) {
    state[fieldName].isLoading = isLoading;
  },
  setDeletePositionDialog(state, value) {
    state.deleteDialog = value;
  },
  setDeleteDepartDialog(state, value) {
    state.deleteDepartDialog = value;
  },
  setCreatePositionDialog(state, value) {
    state.createDialog = value;
  },
  setCreateDepartDialog(state, value) {
    state.createDepartDialog = value;
  },
  setEditedPositionItem(state, editedItem) {
    state.editedItem = Object.assign({}, editedItem);
  },
  setEditedDepartItem(state, editedDepartItem) {
    state.editedDepartItem = Object.assign({}, editedDepartItem);
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
  async fetchDepartmentsList(context) {
    context.commit("setIsLoadingPositions", {
      isLoading: true,
      fieldName: "departmentsList"
    });
    return new Promise((resolve, reject) => {
      Axios.get(`http://localhost:5000/departments`)
        .then(response => {
          context.commit("setDepartmentsList", response.data.result);
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
  async deleteDepart(context, { id }) {
    return new Promise((resolve, reject) => {
      Axios.delete(`http://localhost:5000/department/${id}`)
        .then(() => {
          context.dispatch("fetchDepartmentsList");
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
  async putDepart(context, { id, data }) {
    return new Promise((resolve, reject) => {
      Axios.put(`http://localhost:5000/department/${id}`, data)
        .then(() => {
          context.dispatch("fetchDepartmentsList");
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
  async postDepart(context, { data }) {
    return new Promise((resolve, reject) => {
      Axios.post(`http://localhost:5000/department/`, data)
        .then(() => {
          context.dispatch("fetchDepartmentsList");
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
  async setDeleteDepartDialog(context, { value }) {
    context.commit("setDeleteDepartDialog", value);
  },
  async setCreatePositionDialog(context, { value }) {
    context.commit("setCreatePositionDialog", value);
  },
  async setCreateDepartDialog(context, { value }) {
    context.commit("setCreateDepartDialog", value);
  },
  async setEditedPositionItem(context, { item }) {
    context.commit("setEditedPositionItem", item);
  },
  async setEditedDepartItem(context, { item }) {
    context.commit("setEditedDepartItem", item);
  }
};

export default { state, getters, mutations, actions };
