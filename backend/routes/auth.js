const express = require('express')
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const db = require('../db')
const bc = require('bcrypt')
const JWT_SECRET = process.env.JWT_SECRET
const uploadDir = path.join(__dirname, '../uploads/pic_user')
const router = express.Router()

router.post('/regis', async (req, res) => {
    try {
        const rawForm = req.body?.form
        const form = typeof rawForm === 'string' ? JSON.parse(rawForm) : rawForm
        if (!form || !form.fname || !form.lname || !form.email || !form.username || !form.password || !form.role) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
        }

        const picUser = req.files?.pic_user
        let filename = null
        if (picUser && typeof picUser.mv === 'function') {
            fs.mkdirSync(uploadDir, { recursive: true })
            filename = `${Date.now()}${path.extname(picUser.name)}`
            await picUser.mv(path.join(uploadDir, filename))
        }

        const hash = await bc.hash(form.password, 10)
        const [result] = await db.query(
            'INSERT INTO tb_member(fname,lname,email,username,password,role,pic_user) VALUES(?,?,?,?,?,?,?)',
            [form.fname.trim(), form.lname.trim(), form.email.trim(), form.username.trim(), hash, form.role, filename]
        )
        return res.status(201).json({ id_member: result.insertId, message: 'สมัครสมาชิกสำเร็จ' })
    } catch (error) {
        console.error('Error regis', error)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'อีเมลหรือชื่อผู้ใช้นี้ถูกใช้แล้ว' })
        }
        return res.status(500).json({ message: 'สมัครสมาชิกไม่สำเร็จ กรุณาตรวจสอบข้อมูลแล้วลองอีกครั้ง' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body
        const [rows] = await db.query('SELECT * FROM tb_member WHERE username = ? AND role = ?', [username, role])
        const member = rows[0]
        if (!member || !password || !(await bc.compare(password, member.password))) {
            return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' })
        }
        const token = jwt.sign(
            { id_member: member.id_member, username: member.username, role: member.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        )
        return res.json({ token, role: member.role })
    } catch (error) {
        console.error('Error login', error)
        return res.status(500).json({ message: 'เข้าสู่ระบบไม่สำเร็จ' })
    }
})

module.exports = router
