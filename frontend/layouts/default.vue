<template>
    <v-app>
        <v-app-bar flat elevation="5" rounded>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title class="font-weight-bold">NTC EVALUATION SYSTEM</v-toolbar-title>
            <v-spacer></v-spacer>

            <p class="text-center">คุณ : {{ user.fname }} {{ user.lname }} <br> ตำแหน่ง : {{ user.role }}</p>
            <v-btn variant="text" icon="mdi-logout" @click="logout"></v-btn>
        </v-app-bar>

        <v-navigation-drawer app color="#404040" v-model="drawer" width="260" :temporary="isMobile" :permanent="!isMobile">
            <v-list density="comfortable">
                <v-list-item>
                    <v-list-item-title class="font-weight-bold">NTC EVALUATION SYSTEM</v-list-item-title>
                    <div class="mt-2">
                        <v-chip variant="outlined" class="text-white" color="white"><h4>{{ user.role }}</h4></v-chip>
                    </div>
                </v-list-item>
            </v-list>

            <v-divider color="white" opacity="0.5"></v-divider>

            <v-list density="comfortable">
                <v-list-item>
                    <v-list-item-title class="font-weight-bold">NTC EVALUATION SYSTEM</v-list-item-title>
                    <div class="mt-2">
                        <v-chip variant="outlined" class="text-white" color="white"><h4>{{ user.role }}</h4></v-chip>
                    </div>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api } from '~/API/base';


</script>

<style scoped>

</style>