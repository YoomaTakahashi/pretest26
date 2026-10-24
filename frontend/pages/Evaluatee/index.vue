<template>
    <v-container>
        <v-card elevation="5" rounded>
            <v-sheet :elevation="5" rounded>
                <h1 class="font-weight-bold text-center">DashBoard - Evaluatee</h1>
                <v-card-text>
                    <v-row>
                        <v-col v-for="b in box" :key="b" cols="12" md="4">
                            <v-card :elevation="5" rounded>
                                <div class="text-center text-h5">{{ b.title }}</div>
                                <div class="text-center text-h5">{{ b.value }}</div>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-sheet>
        </v-card>

        <v-card elevation="5" rounded>
            <v-sheet :elevation="5" rounded>
                <h1 class="font-weight-bold text-center">รอบการประเมินทั้งหมด</h1>
                <v-table class="table">
                     <tr>
                        <th class="bg-grey border pa-2" style="width: 10%;">ลำดับ</th>
                        <th class="bg-grey border pa-2" style="width: 10%;">ชื่อนามสกุล</th>
                        <th class="bg-grey border pa-2" style="width: 10%;">รอบการประเมินที่</th>
                        <th class="bg-grey border pa-2" style="width: 10%;">ปีการประเมิน</th>
                     </tr>
                     <tr v-for="r in round" :key="r">
                        <td class="border pa-2 text-center" style="width: 10%;">{{ 1 }}</td>
                        <td class="border pa-2 text-center" style="width: 10%;">{{ r.fname }}-{{ r.lname }}</td>
                        <td class="border pa-2 text-center" style="width: 10%;">{{ r.round_sys }}</td>
                        <td class="border pa-2 text-center" style="width: 10%;">{{ r.year_sys }}</td>
                     </tr>
                </v-table>
            </v-sheet>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { eva,api } from '~/API/base';

const box = ref([])
const round = ref([])

const fetchB = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${api}/dash/eva`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
    } catch (error) {
        console.error('ERror get ',error)
    }
}
const fetchR = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/table`,{headers:{Authorization:`Bearer ${token}`}})
        round.value = res.data
    } catch (error) {
        console.error('ERror get ',error)
    }
}
onMounted(async()=>{
    await Promise.all([fetchB(),fetchR()])
})
</script>

<style scoped>

</style>