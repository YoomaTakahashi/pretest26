<template>
    <v-container>
        <v-row justify="center">

            <v-col cols="12">

                <v-card>
                    <v-card-title>
                        <h1 class="text-center">จัดการกรรมการประเมิน</h1>
                    </v-card-title>
                    <v-card-text>
                        <br>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.fname" label="ชื่อ" :error-messages="error.fname"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.lname" label="นามสกุล" :error-messages="error.lname"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.email" label="อีเมล" :error-messages="error.email" prepend-inner-icon="mdi-email"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.username" label="ชื่อผู้ใช้" :error-messages="error.username" prepend-inner-icon="mdi-account"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-text-field v-model="form.password" label="รหัสผ่าน" :error-messages="error.password" :prepend-inner-icon="show ? 'mdi-eye':'mdi-eye-off'" :type="showPw ? 'text':'password'" @click:prepend-inner="show = !show , showPw = !showPw"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-select v-model="form.role" label="ประเภทสมาชิก" :error-messages="error.role" prepend-inner-icon="mdi-account-group" :items="typeR"></v-select>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <center>
                                        <v-btn class="text-center ma-2" color="primary" type="submit">{{ form.id_member ? 'อัปเดต':'บันทึก' }}</v-btn>
                                        <v-btn class="text-center ma-2" color="error" @click="reset()">ยกเลิก</v-btn>
                                    </center> 
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-text-field label="ค้นหา" placeholder="ค้นหา" v-model="search" prepend-inner-icon="mdi-magnify"></v-text-field>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ชื่อ-สกุล</th>
                                    <th class="border text-center">อีเมล</th>
                                    <th class="border text-center">ชื่อผู้ใช้</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(m,index) in result" :key="m.id_member">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ m.fname }} {{ m.lname }}</td>
                                    <td class="border text-center">{{ m.email }}</td>
                                    <td class="border text-center">{{ m.username }}</td>
                                    <td class="border text-center">
                                        <center>
                                            <v-btn class="text-center text-white ma-2" color="warning" @click="edit(m)" size="small">แก้ไข</v-btn>
                                            <v-btn class="text-center text-white ma-2" color="warning" @click="del(m.id_member)" size="small">ลบ</v-btn>
                                        </center>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center text-red" colspan="12" v-if="result.length">ไม่พบข้อมูล</td>
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


const error = ref<Record<string,string>>({})
const typeR = ['กรรมการประเมิน']
const show = ref(false)
const showPw = ref(false)
const form = ref({
    id_member:null,
    fname:'',
    lname:'',
    email:'',
    username:'',
    password:'',
    role:''
})

const reset = ()=>{
    form.value = {
        id_member:null,
        fname:'',
        lname:'',
        email:'',
        username:'',
        password:'',
        role:''
    }
}
const dataResult = ref([])
const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
const search = ref('')
function validateForm(){

    const f = form.value
    error.value = {}

    if(!f.fname.trim())error.value.fname ='กรุณากรอกชื่อ'
    if(!f.lname.trim())error.value.lname ='กรุณากรอกนามสกุล'
    if(!f.email.trim())error.value.email ='กรุณากรอกอีเมล'
    else if(!emailRegex.test(f.email.trim()))error.value.email ='กรุณากรอกอีเมลให้ถูกต้อง'

    if(!f.username.trim())error.value.username ='กรุณากรอกชื่อผู้ใช้'
    else if(f.username.trim().length < 4)error.value.username ='ชื่อผู้ใช้ต้องยาว 4 ตัวอักษร'

    if(!f.password.trim())error.value.password ='กรุณากรอกรหัสผ่าน'
    else if(f.password.trim().length < 6)error.value.password ='รหัสผ่านต้องยาว 6 ตัวอักษร'

    if(!f.role.trim())error.value.role ='กรุณาเลือกประเภทสมาชิก'

    return Object.keys(error.value).length === 0

}

const token = import.meta.client ? localStorage.getItem('token'):null
const saveMember = async()=>{
    if(!validateForm())return
    const f= form.value
    const payload = {
        fname:f.fname,
        lname:f.lname,
        email:f.email,
        username:f.username,
        password:f.password,
        role:f.role,
        ...(f.password ? {password:f.password}:null)
    }
    try {
        f.id_member
        ? await axios.put(`${staff}/member/update/${f.id_member}`,payload,{headers:{Authorization:`Bearer ${token}`}})
        : await axios.post(`${staff}/member/save`,{...payload,password:f.password},{headers:{Authorization:`Bearer ${token}`}})
        await reset()
        await fetch()
        alert('ทำรายการสำเร็จ')
    } catch (error) {
        console.error("Error save",error);
        
    }
}

const fetch = async()=>{
    try {
        
        const res = await axios.get(`${staff}/member/showC`,{headers:{Authorization:`Bearer ${token}`}})
        dataResult.value = res.data

    } catch (error) {
        console.error("Error get",error);
        
    }
}

const result = computed(()=>{
    if(!search.value)return dataResult.value

    const s = search.value.toLowerCase()

    return dataResult.value.filter((item:any)=>{
        return(
            item.username.toLowerCase().includes(s)
        )
    })
})

const edit = (item:any)=>{
    form.value = {...item}
}

const del = async(id_member)=>{
    if(!confirm('ต้องการลบข้อมูลชุดนี้ใช่หรือไม่'))return
    try {
        await axios.delete(`${staff}/member/delete/${id_member}`,{headers:{Authorization:`Bearer ${token}`}})
        await reset()
        await fetch()
    } catch (error) {
        console.error("Error delete",error);
        
    }
}

onMounted(fetch)

</script>

<style scoped>

</style>