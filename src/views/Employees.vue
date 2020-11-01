<template>
  <MainLayout>
    <v-data-table
      :headers="headers"
      :items="employeesList.value"
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
                        v-model="editedItem.department"
                        label="Отдел"
                      />
                    </v-col>
                    <v-col>
                      <v-select
                        :items="positions"
                        v-model="editedItem.position"
                        label="Должность"
                      />
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
  </MainLayout>
</template>

<script>
import MainLayout from "@/components/layout/MainLayout";
export default {
  name: "Employees",
  components: { MainLayout },
  data: () => ({
    headers: [
      { text: "Id", align: "start", value: "id" },
      { text: "ФИО", value: "fullName" },
      { text: "Отдел", value: "department" },
      { text: "Должность", value: "position" },
      { text: "Действия", value: "actions", sortable: false, width: "200px" }
    ]
  }),
  created() {
    this.$store.dispatch("fetchEmployeesList");
  },
  computed: {
    departments: {
      get() {
        return ["department1", "department2", "department3"];
      }
    },
    positions: {
      get() {
        return ["position1", "position2", "position3"];
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
    }
  },
  methods: {
    editItem(item) {
      this.editedItem = item;
      this.createDialog = true;
    },
    saveItem() {
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
      this.editedItem = Object.assign(
        {},
        this.$store.state.employees.defaultItem
      );
    }
  }
};
</script>

<style scoped></style>
