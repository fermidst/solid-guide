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
        Подтверждение прав: {{ role }}
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="login"
          label="Логин"
          type="password"
        ></v-text-field>
        <v-text-field
          v-model="password"
          label="Пароль"
          type="password"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text to="/">Вернуться на главную</v-btn>
        <v-btn color="blue darken-1" text @click="passwordCheck">ОК</v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="loginFailedSnackbar" color="error"
      >Неправильный логин или пароль</v-snackbar
    >
  </v-dialog>
</template>

<script>
import router from "@/router";
export default {
  name: "PasswordDialog",
  props: {
    role: String
  },
  data: () => ({
    passwordDialog: true,
    login: "",
    password: "",
    loginFailedSnackbar: false
  }),
  methods: {
    passwordCheck() {
      if (
        this.role === "Менеджер" &&
        this.login === "manager" &&
        this.password === "manager"
      ) {
        this.passwordDialog = false;
      } else if (
        this.role === "Администратор" &&
        this.login === "admin" &&
        this.password === "admin"
      ) {
        this.passwordDialog = false;
      } else {
        this.loginFailedSnackbar = true;
      }
    },
    home() {
      router.push("/");
    }
  }
};
</script>

<style scoped></style>
