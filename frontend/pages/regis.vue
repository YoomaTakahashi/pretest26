<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="12">
                <v-card color="#7d0c14">
                    <v-card-title>
                        <center><v-img src="/img/logo2.png" class="mt-3" width="15%"></v-img></center>
                        <h1 class="text-center">สมัครสมาชิก</h1>
                    </v-card-title>
                    <v-card-text class="bg-white">
                        <br>
                        <v-alert v-if="submitMessage" variant="tonal" :type="submitError ? 'error' : 'info'">{{ submitMessage }}</v-alert>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อ" v-model="form.fname" :error-messages="error.fname"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="นามสกุล" v-model="form.lname" :error-messages="error.lname"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="อีเมล" v-model="form.email" :error-messages="error.email" prepend-inner-icon="mdi-email"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ชื่อผู้ใช้" v-model="form.username" :error-messages="error.username" prepend-inner-icon="mdi-account"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="รหัสผ่าน" v-model="form.password" :error-messages="error.password" :prepend-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="showPw ? 'text' : 'password'" @click:prepend-inner="show = !show; showPw = !showPw"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field label="ยืนยันรหัสผ่าน" v-model="conP" :error-messages="error.conP" :prepend-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="showPw2 ? 'text' : 'password'" @click:prepend-inner="show2 = !show2; showPw2 = !showPw2"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select label="ประเภทสมาชิก" v-model="form.role" :error-messages="error.role" prepend-inner-icon="mdi-account-group" :items="typeR"></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-file-input label="รูปภาพสมาชิก" v-model="pic_user" :error-messages="error.pic_user" accept=".png,.jpg,.jpeg" hint="รองรับไฟล์ PNG และ JPG" persistent-hint></v-file-input>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <center>
                                        <v-btn class="ma-2" color="primary" type="submit" :loading="isSubmitting" :disabled="isSubmitting">สมัครสมาชิก</v-btn>
                                        <v-btn class="ma-2" color="error" type="reset" :disabled="isSubmitting">ยกเลิก</v-btn>
                                    </center>
                                </v-col>
                            </v-row>
                        </v-form>
                        <nuxt-link to="/" class="text-center text-blue text-decoration-none"><p>หากมีบัญชีอยู่แล้ว? เข้าสู่ระบบ</p></nuxt-link>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { api } from '~/API/base'

definePageMeta({ layout: false })

const error = ref<Record<string, string>>({})
const pic_user = ref<File | null>(null)
const typeR = ['ฝ่ายบุคลากร', 'ผู้รับการประเมินผล', 'กรรมการประเมิน']
const show = ref(false)
const show2 = ref(false)
const showPw = ref(false)
const showPw2 = ref(false)
const submitMessage = ref('')
const submitError = ref(false)
const isSubmitting = ref(false)
const form = ref({ fname: '', lname: '', email: '', username: '', password: '', role: '' })
const conP = ref('')
const emailRegex = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i

function validateForm() {
    const f = form.value
    error.value = {}
    if (!f.fname.trim()) error.value.fname = 'กรุณากรอกชื่อ'
    if (!f.lname.trim()) error.value.lname = 'กรุณากรอกนามสกุล'
    if (!f.email.trim()) error.value.email = 'กรุณากรอกอีเมล'
    else if (!emailRegex.test(f.email.trim())) error.value.email = 'กรุณากรอกอีเมลให้ถูกต้อง'
    if (!f.username.trim()) error.value.username = 'กรุณากรอกชื่อผู้ใช้'
    else if (f.username.trim().length < 4) error.value.username = 'ชื่อผู้ใช้ต้องยาวอย่างน้อย 4 ตัวอักษร'
    if (!f.password.trim()) error.value.password = 'กรุณากรอกรหัสผ่าน'
    else if (f.password.trim().length < 6) error.value.password = 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร'
    else if (f.password.trim() !== conP.value.trim()) error.value.conP = 'รหัสผ่านไม่ตรงกัน'
    if (!conP.value.trim()) error.value.conP = 'กรุณายืนยันรหัสผ่าน'
    if (!f.role.trim()) error.value.role = 'กรุณาเลือกประเภทสมาชิก'
    return Object.keys(error.value).length === 0
}

async function saveMember() {
    submitMessage.value = ''
    submitError.value = false
    if (!validateForm()) {
        submitError.value = true
        submitMessage.value = 'กรุณาตรวจสอบข้อมูลที่กรอกให้ถูกต้อง'
        return
    }

    isSubmitting.value = true
    const formdata = new FormData()
    formdata.append('form', JSON.stringify(form.value))
    if (pic_user.value instanceof File) formdata.append('pic_user', pic_user.value)
    try {
        await axios.post(`${api}/auth/regis`, formdata, { timeout: 15000 })
        alert('สมัครสมาชิกสำเร็จ')
        await navigateTo('/', { replace: true })
    } catch (err) {
        console.error('Error regis', err)
        submitError.value = true
        submitMessage.value = axios.isAxiosError(err)
            ? (err.response?.data?.message || (err.code === 'ECONNABORTED' ? 'backend ตอบกลับช้า กรุณาลองใหม่' : 'สมัครสมาชิกไม่สำเร็จ กรุณาตรวจสอบข้อมูล'))
            : 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
</style>
