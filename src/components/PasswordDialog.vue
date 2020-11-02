<template>
  <v-dialog
    v-model="passwordDialog"
    max-width="700px"
    persistent
    @keydown.enter="passwordCheck"
    @keydown.esc="home"
  >
    <v-card>
      <v-card-title class="headline justify-center">
        Подтверждение прав
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="password"
          label="Пароль администратора"
          type="password"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="passwordCheck">ОК</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import router from "@/router";
export default {
  name: "PasswordDialog",
  data: () => ({
    passwordDialog: true,
    password: ""
  }),
  methods: {
    passwordCheck() {
      if (this.password === "admin") {
        this.passwordDialog = false;
      }
    },
    home() {
      router.push("/");
    }
  }
};
</script>

<style scoped></style>
