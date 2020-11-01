<template>
  <MainLayout class="home">
    <template v-slot:icon>
      <v-icon>mdi-account-group</v-icon>
    </template>
    <v-container>
      <v-row class="text-center">
        <v-col>
          <h1>Система управления персоналом</h1>
        </v-col>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script>
// @ is an alias to /src
import MainLayout from "@/components/layout/MainLayout";

export default {
  name: "Home",
  components: {
    MainLayout
  }
};
</script>
