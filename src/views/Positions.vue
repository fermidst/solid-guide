<template>
  <MainLayout>
    <v-container>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="positionsList.value"
            sort-by="id"
            class="elevation-4 ma-4 pa-4"
            disable-pagination
            hide-default-footer
            calculate-widths
          >
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>Должности</v-toolbar-title>
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
                      >Новая должность</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Информация о должности</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row justify="space-around">
                          <v-col>
                            <v-text-field
                              v-model="editedItem.name"
                              label="Наименование должности"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="editedItem.salary"
                              label="Заработная плата на должности"
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-text-field
                              v-model="editedItem.workingHoursPerWeek"
                              label="Количество рабочих часов в неделю"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="cancelCreateDialog"
                      >
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
              {{ positionsList.value.indexOf(item) + 1 }}
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
        </v-col>
        <v-col>
          <v-data-table
            :headers="departHeaders"
            :items="departList.value"
            sort-by="id"
            class="elevation-4 ma-4 pa-4"
            disable-pagination
            hide-default-footer
            calculate-widths
          >
            <template #top>
              <v-toolbar flat>
                <v-toolbar-title>Отделы</v-toolbar-title>
                <v-divider class="mx-4" inset vertical />
                <v-spacer />
                <v-dialog
                  v-model="createDepartDialog"
                  max-width="800px"
                  @click:outside="cancelCreateDepartDialog"
                  @keydown.esc="cancelCreateDepartDialog"
                >
                  <template #activator="{on, attrs}">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on">
                      Новый отдел
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="headline">Информация об отделе</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row justify="space-around">
                          <v-col>
                            <v-text-field
                              v-model="editedDepartItem.name"
                              label="Наименование отдела"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="cancelCreateDepartDialog"
                      >
                        Отмена
                      </v-btn>
                      <v-btn color="blue darken-1" text @click="saveDepartItem">
                        Сохранить
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-toolbar>
            </template>
            <template #item.id="{item}">
              {{ departList.value.indexOf(item) + 1 }}
            </template>
            <template #item.actions="{item}">
              <v-icon class="mx-2" @click="editDepartItem(item)">
                mdi-account-multiple
              </v-icon>
              <v-icon class="mx-2" @click="deleteDepartItem(item)">
                mdi-account-multiple-remove
              </v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="deleteDialog" max-width="700px">
      <v-card>
        <v-card-title class="headline justify-center">
          Вы уверены, что хотите удалить эту должность?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">
            OK
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDepartDialog" max-width="700px">
      <v-card>
        <v-card-title class="headline justify-center">
          Вы уверены, что хотите удалить этот отдел?
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="deleteDepartDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteDepartItemConfirm">
            OK
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <PasswordDialog role="Администратор" />
  </MainLayout>
</template>

<script>
import MainLayout from "@/components/layout/MainLayout";
import PasswordDialog from "@/components/PasswordDialog";
export default {
  name: "Positions",
  components: { PasswordDialog, MainLayout },
  data: () => ({
    headers: [
      { text: "№", align: "start", value: "id" },
      { text: "Наименование должности", value: "name" },
      { text: "Зарплата", value: "salary" },
      {
        text: "Количество рабочих часов в неделю",
        value: "workingHoursPerWeek"
      },
      { text: "Действия", value: "actions", sortable: false, width: "200px" }
    ],
    departHeaders: [
      { text: "№", align: "start", value: "id" },
      { text: "Наименование отдела", value: "name" },
      { text: "Действия", value: "actions", sortable: false, width: "200px" }
    ]
  }),
  created() {
    this.$store.dispatch("fetchPositionsList");
    this.$store.dispatch("fetchDepartmentsList");
  },
  computed: {
    positionsList: {
      get() {
        return this.$store.state.positions.positionsList;
      }
    },
    departList: {
      get() {
        return this.$store.state.positions.departmentsList;
      }
    },
    createDialog: {
      get() {
        return this.$store.state.positions.createDialog;
      },
      set(value) {
        this.$store.dispatch("setCreatePositionDialog", { value: value });
      }
    },
    createDepartDialog: {
      get() {
        return this.$store.state.positions.createDepartDialog;
      },
      set(value) {
        this.$store.dispatch("setCreateDepartDialog", { value: value });
      }
    },
    deleteDialog: {
      get() {
        return this.$store.state.positions.deleteDialog;
      },
      set(value) {
        this.$store.dispatch("setDeletePositionDialog", { value: value });
      }
    },
    deleteDepartDialog: {
      get() {
        return this.$store.state.positions.deleteDepartDialog;
      },
      set(value) {
        this.$store.dispatch("setDeleteDepartDialog", { value: value });
      }
    },
    editedItem: {
      get() {
        return this.$store.state.positions.editedItem;
      },
      set(value) {
        this.$store.dispatch("setEditedPositionItem", { item: value });
      }
    },
    editedDepartItem: {
      get() {
        return this.$store.state.positions.editedDepartItem;
      },
      set(value) {
        this.$store.dispatch("setEditedDepartItem", { item: value });
      }
    }
  },
  methods: {
    editItem(item) {
      this.editedItem = item;
      this.createDialog = true;
    },
    editDepartItem(item) {
      this.editedDepartItem = item;
      this.createDepartDialog = true;
    },
    saveItem() {
      if (this.editedItem.id > 0) {
        this.$store.dispatch("putPosition", {
          id: this.editedItem.id,
          data: this.editedItem
        });
      } else {
        this.$store.dispatch("postPosition", { data: this.editedItem });
      }
      this.createDialog = false;
      this.clearFields();
    },
    saveDepartItem() {
      if (this.editedDepartItem.id > 0) {
        this.$store.dispatch("putDepart", {
          id: this.editedDepartItem.id,
          data: this.editedDepartItem
        });
      } else {
        this.$store.dispatch("postDepart", { data: this.editedDepartItem });
      }
      this.createDepartDialog = false;
      this.clearFields();
    },
    cancelCreateDialog() {
      this.createDialog = false;
      this.clearFields();
    },
    cancelCreateDepartDialog() {
      this.createDepartDialog = false;
      this.clearFields();
    },
    deleteItem(item) {
      this.editedItem = item;
      this.deleteDialog = true;
    },
    deleteDepartItem(item) {
      this.editedDepartItem = item;
      this.deleteDepartDialog = true;
    },
    deleteItemConfirm() {
      this.$store.dispatch("deletePosition", {
        id: this.$store.state.positions.editedItem.id
      });
      this.deleteDialog = false;
      this.clearFields();
    },
    deleteDepartItemConfirm() {
      this.$store.dispatch("deleteDepart", {
        id: this.$store.state.positions.editedDepartItem.id
      });
      this.deleteDepartDialog = false;
      this.clearFields();
    },
    clearFields() {
      this.editedItem = Object.assign(
        {},
        this.$store.state.positions.defaultItem
      );
      this.editedDepartItem = Object.assign(
        {},
        this.$store.state.positions.defaultDepartItem
      );
    }
  }
};
</script>

<style scoped></style>
