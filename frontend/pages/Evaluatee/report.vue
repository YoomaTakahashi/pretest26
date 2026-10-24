<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form v-if="user.status_eva === 2" >
                    <h1 class="font-weight-bold">ผลการประเมินของผู้รับการประเมินผล</h1>
                     <v-row v-for="(topic,t) in topics" :key="topic.id_topic">
                        <v-col cols="12">
                            <h1 class="font-weight-bold">{{t+1}}.{{ topic.name_topic }}</h1>
                            <v-table class="table">
                                <tr>
                                    <th class="bg-grey border pa-2" style="width: 10%;">ตัวชี้วัด</th>
                                    <th class="bg-grey border pa-2" style="width: 10%;">รายละเอียดตัวชี้วัด</th>
                                    <th class="bg-grey border pa-2" style="width: 10%;">น้ำหนักคะแนน</th>
                                    <th class="bg-grey border pa-2" style="width: 10%;">คะแนนเต็ม</th>
                                    <th class="bg-grey border pa-2" style="width: 10%;">ประธาน</th>
                                    <th class="bg-grey border pa-2" style="width: 10%;">กรรมการ</th>
                                    <th class="bg-grey border pa-2" style="width: 10%;">เลขา</th>
                                    <th class="bg-grey border pa-2" style="width: 10%;">คะแนนที่ได้</th>
                                </tr>
                                <tr v-for="(indicate,i) in topic.indicates" :key="indicate.id_indicate">
                                    <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.name_indicate }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.detail_indicate }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.point_indicate }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{ indicate.point_indicate*4 }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{  scores[indicate.id_indicate]?. a ?? 'รอประธานประเมิน'  }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{  scores[indicate.id_indicate]?. b ?? 'รอกรรมการประเมิน'  }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{  scores[indicate.id_indicate]?. c ?? 'รอเลขาประเมิน'  }}</td>
                                    <td class="border pa-2 text-center" style="width: 10%;">{{  (((scores[indicate.id_indicate]?. a ?? 0)+(scores[indicate.id_indicate]?. a ?? 0 )+(scores[indicate.id_indicate]?. a ?? 0 ))/3).toFixed(2)  }}</td>
                                </tr>
                            </v-table>
                        </v-col>
                     </v-row>
                     <div class="mt-3 text-end">
                        <v-card color="green" type="submit">คะแนนรวมสุทธิ : {{ ((user.total_commit)/3).toFixed(2) }} คะแนน</v-card>
                     </div>
                     <div class="mt-4">
                        <v-card>
                            <label for="">ข้อเสนอแนะกรรมการประเมิน</label>
                            <v-row>
                                <v-col cols="12" v-for="commit,c in commits" :key="commit.id_commit">
                                    <img :src="`http://localhost:3001/signature/${commit.signature}`" :alt="`รอ${commit.level_commit}ประเมิน`" width="20%" > <br>
                                    {{ c+1 }}.{{ commit.fname }} : {{ commit.lname }} <br>
                                    {{ commit.level_commit }}
                                </v-col>
                            </v-row>
                        </v-card>
                     </div>
                     <div class="mt-3 text-center">
                        <v-btn color="warning" @click="print" type="submit">พิมพ์</v-btn>
                     </div>
                </v-form>
                <v-alert v-else-if="user.status_eva === 1" variant="tonal" type="warning" color="warning">ยังไม่ได้ประเมินตนเอง</v-alert>
                <v-alert v-else variant="tonal" type="error" color="error">ไม่มีแบบประเมิน</v-alert >
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { eva,api } from '~/API/base';

const user =ref<any>({})
const topics = ref<any>([])
const commits = ref<any>([])
const scores = ref<any>([])

const print = ()=>{
    window.print()
}



const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/selfeva/user`,{headers:{Authorization:`Bearer ${token}`}})
        user.value = res.data
    } catch (error) {
        console.error('Error get User',error)
    }
}
const fetchTopic = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/selfeva/topic`,{headers:{Authorization:`Bearer ${token}`}})
        topics.value = res.data
    } catch (error) {
        console.error('Error get User',error)
    }
}
const fetchCommit = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/score_commit/commit`,{headers:{Authorization:`Bearer ${token}`}})
        commits.value = res.data
    } catch (error) {
        console.error('Error get User',error)
    }
}
const fetchScore = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${eva}/score_commit/scores`,{headers:{Authorization:`Bearer ${token}`}})
        scores.value = res.data
    } catch (error) {
        console.error('Error get User',error)
    }
}

onMounted(async()=>{
    await Promise.all([fetch(),fetchTopic(),fetchScore(),fetchCommit()])
})


</script>

<style scoped>

</style>