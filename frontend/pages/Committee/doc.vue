<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card>
                    <v-card-title>
                        <h1 class="text-center">เอกสารและคู่มือการประเมิน</h1>
                    </v-card-title>
                    <v-card-text>
                        <v-table class="mt-3">
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ชื่อเอกสาร</th>
                                    <th class="border text-center">วันที่ออกเอกสาร</th>
                                    <th class="border text-center">เอกสาร</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_doc">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.name_doc }}</td>
                                    <td class="border text-center">{{ formatDate(items.day_doc) }}</td>
                                    <td class="border text-center">
                                        <v-btn class="text-center text-white ma-2" color="info" prepend-icon="mdi-eye" @click="view(items.file)" size="small">เปิดดู</v-btn>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-red text-center" v-if="result.length === 0" colspan="12">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api, staff } from '~/API/base'

const name_doc = ref('')
const file = ref<File | null>(null)
const error = ref<Record<string,string>>({})
const dataResult = ref([])
const result = ref([])
const reset = ()=>{
    name_doc.value = ''
    file.value = null
}
const search = ref('')

const token = import.meta.client ? localStorage.getItem('token'):null




const fetch = async()=>{

    try {
        const res = await axios.get(`${api}/docnoe/`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    } catch (error) {
        console.error("Error get",error);
        
    }

}
onMounted(fetch)




const formatDate = (dateStr:string)=>{
    if(!dateStr)return '-'
    const date = new Date(dateStr)
    const day = String(date.getDate()).padStart(2,'0')
    const month = String(date.getMonth()).padStart(2,'0')
    const year = String(date.getFullYear())

    return `${day}/${month}/${year}`
}



const view = (file:string)=>{
    const url = new URL(`/uploads/document/${file}`,api).href
    window.open(url,'_blank')
}


</script>

<style scoped>

</style>