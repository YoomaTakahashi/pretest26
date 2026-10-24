<template>
    <v-app>
        <v-app-bar :color="bg(user.role)" class="rounded-b" flat elevation="5" >
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
                <v-list-item v-for="item in navitem" :key="item.title" :to="item.to">
                    <v-list-item-title >
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <v-container fluid class="py-3">
                <slot></slot>
            </v-container>
            <v-footer class="text-caption justify-center">© 2026 NTC EVALUATION SYSTEM</v-footer>
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import axios from 'axios'
import { useDisplay } from 'vuetify';
import { api } from '~/API/base';

const drawer = ref(false)
const user = ref<any>({})
const {mdAndDown} = useDisplay()
const isMobile = computed(()=> mdAndDown.value)

const logout = ()=>{
    if(!confirm('ท่านต้องการออกจากระบบใช่หรือไม่'))return
    localStorage.removeItem('token')
    navigateTo('/',{replace:true})
}

const roles = [
    //staff navitem
    {title:'หน้าหลัก',to:'/Staff/',role:'ฝ่ายบุคลากร'},
    {title:'จัดการผู้รับการประเมิน',to:'/Staff/Manage_eva',role:'ฝ่ายบุคลากร'},
    {title:'จัดการกรรมการประเมิน',to:'/Staff/Manage_commit',role:'ฝ่ายบุคลากร'},
    {title:'จัดการหัวข้อประเมิน',to:'/Staff/Topic',role:'ฝ่ายบุคลากร'},
    {title:'จัดการตัวชี้วัด',to:'/Staff/Indicate',role:'ฝ่ายบุคลากร'},
    {title:'จัดการรอบการประเมิน',to:'/Staff/round',role:'ฝ่ายบุคลากร'},
    {title:'จัดการการแบบประเมิน',to:'/Staff/Eva',role:'ฝ่ายบุคลากร'},
    {title:'ผลการประเมินของผู้รับการประเมินผล',to:'/Staff/Score_evaList',role:'ฝ่ายบุคลากร'},
    {title:'ผลการประเมินของกรรมการประเมิน',to:'/Staff/Score_commitList',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของผู้รับการประเมินผล',to:'/Staff/Status_eva',role:'ฝ่ายบุคลากร'},
    {title:'สถานะการประเมินของกรรมการประเมิน',to:'/Staff/Status_commit',role:'ฝ่ายบุคลากร'},
    {title:'เอกสารหรือคู่มือการประเมิน',to:'/Staff/Document',role:'ฝ่ายบุคลากร'},
    {title:'รายงานผล',to:'/Staff/report',role:'ฝ่ายบุคลากร'},
    {title:'การสำรองข้อหมด',to:'/Staff/backup',role:'ฝ่ายบุคลากร'},

    {title:'หน้าหลัก',to:'/Evaluatee/',role:'ผู้รับการประเมินผล'},
    {title:'แก้ไขข้อมูลส่วนตัว',to:'/Evaluatee/edit_eva',role:'ผู้รับการประเมินผล'},
    {title:'แบบประเมินตนเอง',to:'/Evaluatee/selfeva',role:'ผู้รับการประเมินผล'},
    {title:'ตรวจสอบผลการประเมิน',to:'/Evaluatee/check_score',role:'ผู้รับการประเมินผล'},
    {title:'รายงานผล',to:'/Evaluatee/report',role:'ผู้รับการประเมินผล'},
    {title:'คู่มือการประเมิน',to:'/Evaluatee/doc',role:'ผู้รับการประเมินผล'},

    {title:'รายชื่อผู้รับการประเมินผล',to:'/Committee/',role:'กรรมการประเมิน'},
    {title:'ดำเนินการประเมิน',to:'/Committee/show_eva',role:'กรรมการประเมิน'},
    {title:'ตรวจสอบผลและยืนยัน',to:'/Committee/check_confirm',role:'กรรมการประเมิน'},
    {title:'คู่มือการประเมิน',to:'/Committee/doc',role:'กรรมการประเมิน'},
]

const navitem = computed(()=> roles.filter((item)=> item.role.includes(user.value.role)))

const fetch = async()=>{
    const token = localStorage.getItem('token')
    if(!token){
        localStorage.removeItem('token')
    }
    try {
        const res = await axios.get(`${api}/profile`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    } catch (error) {
        console.error("Error get profile ",error)
    }
}

onMounted(fetch)
const bg = (role:string) =>{
    if(role === 'ฝ่ายบุคลากร')return '#647687'
    if(role === 'กรรมการประเมิน')return '#007FFF'
    if(role === 'ผู้รับการประเมินผล')return '#7d0c14'
}
</script>

<style scoped>

</style>