<template>
  <MainLayout>
    <v-data-table
      :headers="headers"
      :items="employeesList.value"
      :search="search"
      sort-by="id"
      class="elevation-4 ma-4 pa-4"
      disable-pagination
      hide-default-footer
      calculate-widths
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Сотрудники</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Поиск"
            single-line
            hide-details
          ></v-text-field>
          <v-spacer />
          <v-dialog
            v-model="createDialog"
            max-width="800px"
            @click:outside="cancelCreateDialog"
            @keydown.esc="cancelCreateDialog"
          >
            <template #activator="{on, attrs}">
              <v-btn color="primary" dark v-bind="attrs" v-on="on"
                >Новый сотрудник</v-btn
              >
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Информация о сотруднике</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row justify="space-around">
                    <v-col>
                      <v-text-field
                        v-model="editedItem.fullName"
                        label="ФИО сотрудника"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-select
                        :items="departments"
                        v-model="selectedDepart"
                        item-text="name"
                        return-object
                        label="Отдел"
                      />
                    </v-col>
                    <v-col>
                      <v-select
                        :items="positions"
                        v-model="selectedPosition"
                        item-text="name"
                        return-object
                        label="Должность"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model.number="editedItem.passportSeries"
                        label="Серия паспорта"
                        :rules="[
                          v =>
                            v.length === 4 ||
                            'Серия паспорта состоит из четырех цифр'
                        ]"
                      ></v-text-field>
                    </v-col>
                    <v-col
                      ><v-text-field
                        v-model.number="editedItem.passportNumber"
                        label="Номер паспорта"
                        :rules="[
                          v =>
                            v.length === 6 ||
                            'Номер паспорта состоит из шести цифр'
                        ]"
                      ></v-text-field
                    ></v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model.number="editedItem.lengthOfWork"
                        label="Стаж работы в годах"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="editedItem.previousWorkPlace"
                        label="Предыдущее место работы"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-col
                        ><v-textarea
                          v-model="editedItem.otherInfo"
                          label="Прочая информация"
                        ></v-textarea
                      ></v-col>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-card>
                        <v-card-text>
                          <h3 class="text-center red--text">
                            Перед сохранением, подтвердите текущий отдел и
                            должность сотрудника
                          </h3>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="cancelCreateDialog">
                  Отмена
                </v-btn>
                <v-btn color="blue darken-1" text @click="saveItem"
                  >Сохранить</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template #item.id="{item}">
        {{ employeesList.value.indexOf(item) + 1 }}
      </template>
      <template #item.position="{item}">
        {{ positions.find(p => p.id === item.positionId).name }}
      </template>
      <template #item.department="{item}">
        {{ departments.find(d => d.id === item.departmentId).name }}
      </template>
      <template #item.info="{item}">
        <v-expansion-panels accordion>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <p class="text-center">Показать детальную информацию</p>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container>
                <v-row>
                  <v-col> Серия паспорта: {{ item.passportSeries }} </v-col>
                </v-row>
                <v-row>
                  <v-col> Номер паспорта: {{ item.passportNumber }} </v-col>
                </v-row>
                <v-row>
                  <v-col> Прочая информация: {{ item.otherInfo }} </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    Стаж работы в годах: {{ item.lengthOfWork }} г.
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    Предыдущее место работы: {{ item.previousWorkPlace }}
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
      <template #item.actions="{item}">
        <v-icon class="mx-2" @click="editItem(item)">
          mdi-account-edit
        </v-icon>
        <v-icon class="mx-2" @click="deleteItem(item)">
          mdi-account-remove
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="deleteDialog" max-width="700px">
      <v-card>
        <v-card-title class="headline justify-center"
          >Вы уверены, что хотите уволить этого сотрудника?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <PasswordDialog role="Менеджер" />
    <v-snackbar v-model="errorSnackbar" color="error"
      >Произошла ошибка при выполнении запроса</v-snackbar
    >
  </MainLayout>
</template>

<script>
import MainLayout from "@/components/layout/MainLayout";
import PasswordDialog from "@/components/PasswordDialog";
export default {
  name: "Employees",
  components: { MainLayout, PasswordDialog },
  data: () => ({
    search: "",
    headers: [
      { text: "№", align: "start", value: "id", filterable: false },
      { text: "ФИО", value: "fullName" },
      {
        text: "Отдел",
        value: "department",
        sortable: false,
        filterable: false
      },
      {
        text: "Должность",
        value: "position",
        sortable: false,
        filterable: false
      },
      {
        text: "Дополнительная информация",
        value: "info",
        sortable: false,
        filterable: false
      },
      {
        text: "Действия",
        value: "actions",
        sortable: false,
        filterable: false,
        width: "200px"
      }
    ]
  }),
  created() {
    this.$store.dispatch("fetchEmployeesList");
    this.$store.dispatch("fetchPositionsList");
    this.$store.dispatch("fetchDepartmentsList");
  },
  computed: {
    departments: {
      get() {
        return this.$store.state.positions.departmentsList.value;
      }
    },
    positions: {
      get() {
        return this.$store.state.positions.positionsList.value;
      }
    },
    employeesList: {
      get() {
        return this.$store.state.employees.employeesList;
      }
    },
    createDialog: {
      get() {
        return this.$store.state.employees.createDialog;
      },
      set(value) {
        this.$store.dispatch("setCreateDialog", { value: value });
      }
    },
    deleteDialog: {
      get() {
        return this.$store.state.employees.deleteDialog;
      },
      set(value) {
        this.$store.dispatch("setDeleteDialog", { value: value });
      }
    },
    editedItem: {
      get() {
        return this.$store.state.employees.editedItem;
      },
      set(value) {
        this.$store.dispatch("setEditedItem", { item: value });
      }
    },
    editedItemPositionId: {
      get() {
        return this.$store.state.positions.editedItem.positionId;
      },
      set(value) {
        this.$store.dispatch("setEditedPositionItemField", {
          fieldName: "positionId",
          value: value
        });
      }
    },
    editedItemDepartId: {
      get() {
        return this.$store.state.positions.editedItem.departmentId;
      },
      set(value) {
        this.$store.dispatch("setEditedPositionItemField", {
          fieldName: "departmentId",
          value: value
        });
      }
    },
    selectedPosition: {
      get() {
        return this.$store.state.employees.selectedPosition;
      },
      set(value) {
        this.$store.dispatch("setSelectedPosition", { value: value });
      }
    },
    selectedDepart: {
      get() {
        return this.$store.state.employees.selectedDepart;
      },
      set(value) {
        this.$store.dispatch("setSelectedDepart", { value: value });
      }
    },
    errorSnackbar: {
      get() {
        return this.$store.state.employees.errorSnackbar;
      },
      set(value) {
        this.$store.dispatch("setErrorSnackbar", { value: value });
      }
    }
  },
  methods: {
    editItem(item) {
      this.editedItem = item;
      this.createDialog = true;
    },
    saveItem() {
      this.editedItemPositionId = this.selectedPosition.id;
      this.editedItemDepartId = this.selectedDepart.id;
      if (this.editedItem.id > 0) {
        this.$store.dispatch("putEmployee", {
          id: this.editedItem.id,
          data: this.editedItem
        });
      } else {
        this.$store.dispatch("postEmployee", { data: this.editedItem });
      }
      this.createDialog = false;
      this.clearFields();
    },
    cancelCreateDialog() {
      this.createDialog = false;
      this.clearFields();
    },
    deleteItem(item) {
      this.editedItem = item;
      this.deleteDialog = true;
    },
    deleteItemConfirm() {
      this.$store.dispatch("deleteEmployee", {
        id: this.$store.state.employees.editedItem.id
      });
      this.deleteDialog = false;
      this.clearFields();
    },
    clearFields() {
      this.$store.dispatch("setDefaultEditedItem");
      this.$store.dispatch("setDefaultSelectedPosition");
      this.$store.dispatch("setDefaultSelectedDepart");
    }
  }
};
</script>

<style scoped></style>
