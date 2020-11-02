<template>
  <MainLayout>
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
          >Вы уверены, что хотите удалить эту должность?</v-card-title
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
    <PasswordDialog />
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
      { text: "Id", align: "start", value: "id" },
      { text: "Наименование должности", value: "name" },
      { text: "Зарплата", value: "salary" },
      {
        text: "Количество рабочих часов в неделю",
        value: "workingHoursPerWeek"
      },
      { text: "Действия", value: "actions", sortable: false, width: "200px" }
    ]
  }),
  created() {
    this.$store.dispatch("fetchPositionsList");
  },
  computed: {
    positionsList: {
      get() {
        return this.$store.state.positions.positionsList;
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
    deleteDialog: {
      get() {
        return this.$store.state.positions.deleteDialog;
      },
      set(value) {
        this.$store.dispatch("setDeletePositionDialog", { value: value });
      }
    },
    editedItem: {
      get() {
        return this.$store.state.positions.editedItem;
      },
      set(value) {
        this.$store.dispatch("setEditedPositionItem", { item: value });
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
    cancelCreateDialog() {
      this.createDialog = false;
      this.clearFields();
    },
    deleteItem(item) {
      this.editedItem = item;
      this.deleteDialog = true;
    },
    deleteItemConfirm() {
      this.$store.dispatch("deletePosition", {
        id: this.$store.state.positions.editedItem.id
      });
      this.deleteDialog = false;
      this.clearFields();
    },
    clearFields() {
      this.editedItem = Object.assign(
        {},
        this.$store.state.positions.defaultItem
      );
    }
  }
};
</script>

<style scoped></style>
