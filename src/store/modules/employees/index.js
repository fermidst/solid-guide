import Axios from "axios";

const state = {
  employeesList: {
    isLoading: false,
    value: []
  },
  createDialog: false,
  deleteDialog: false,
  editedItem: { id: 0, fullName: "", department: "", positionId: 0 },
  defaultItem: { id: 0, fullName: "", department: "", positionId: 0 },
  selectedPosition: { id: 0, name: "", salary: 0, workingHoursPerWeek: 0 },
  defaultPosition: { id: 0, name: "", salary: 0, workingHoursPerWeek: 0 }
};

const getters = {};

const mutations = {
  setEmployeesList(state, employeesList) {
    state.employeesList.value = employeesList;
    state.employeesList.isLoading = false;
  },
  setIsLoadingEmployees(state, { isLoading, fieldName }) {
    state[fieldName].isLoading = isLoading;
  },
  setDeleteDialog(state, value) {
    state.deleteDialog = value;
  },
  setCreateDialog(state, value) {
    state.createDialog = value;
  },
  setEditedItem(state, editedItem) {
    state.editedItem = Object.assign({}, editedItem);
  },
  setSelectedPosition(state, value) {
    state.selectedPosition = value;
  },
  setEditedPositionItemField(state, { fieldName, value }) {
    state.editedItem[fieldName] = value;
  },
  setDefaultSelectedPosition(state) {
    state.selectedPosition = state.defaultPosition;
  },
  setDefaultEditedItem(state) {
    state.editedItem = state.defaultItem;
  }
};

const actions = {
  async fetchEmployeesList(context) {
    context.commit("setIsLoadingEmployees", {
      isLoading: true,
      fieldName: "employeesList"
    });
    return new Promise((resolve, reject) => {
      Axios.get(`http://localhost:5000/employees`)
        .then(response => {
          context.commit("setEmployeesList", response.data.result);
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  async deleteEmployee(context, { id }) {
    return new Promise((resolve, reject) => {
      Axios.delete(`http://localhost:5000/employee/${id}`)
        .then(() => {
          context.dispatch("fetchEmployeesList");
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  async putEmployee(context, { id, data }) {
    return new Promise((resolve, reject) => {
      Axios.put(`http://localhost:5000/employee/${id}`, data)
        .then(() => {
          context.dispatch("fetchEmployeesList");
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  async postEmployee(context, { data }) {
    return new Promise((resolve, reject) => {
      Axios.post(`http://localhost:5000/employee/`, data)
        .then(() => {
          context.dispatch("fetchEmployeesList");
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  async setDeleteDialog(context, { value }) {
    context.commit("setDeleteDialog", value);
  },
  async setCreateDialog(context, { value }) {
    context.commit("setCreateDialog", value);
  },
  async setEditedItem(context, { item }) {
    context.commit("setEditedItem", item);
  },
  async setSelectedPosition(context, { value }) {
    context.commit("setSelectedPosition", value);
  },
  async setEditedPositionItemField(context, { fieldName, value }) {
    context.commit("setEditedPositionItemField", {
      fieldName: fieldName,
      value: value
    });
  },
  async setDefaultSelectedPosition(context) {
    context.commit("setDefaultSelectedPosition");
  },
  async setDefaultEditedItem(context) {
    context.commit("setDefaultEditedItem");
  }
};

export default { state, getters, mutations, actions };
