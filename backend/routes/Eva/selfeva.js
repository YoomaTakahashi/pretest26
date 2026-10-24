const express = require('express')
const path = require('path')
const db = require('../../db')
const uploadDir = path.join(__dirname, '../../uploads/file_eva')
const router = express.Router()
const {verifyToken,requireRole} = require('../../middleware/authmiddleware')

router.get('/user',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try {
        const id_member = req.user.id_member
        const [rows] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by id_eva`,[id_member])
        res.json(rows[0])
    } catch (error) {
        console.error("ERROR GET PROFILE",error)
        res.status(500).json({message:'ERROR GET PROFILE'})
    }
})

router.get('/topic',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate`)
        const result = topics.map(t=>({
            ...t, indicates:indicates.filter((i)=> i.id_topic ===t.id_topic )
        }))
        res.json(result)
    } catch (error) {
        console.error("ERROR GET PROFILE",error)
        res.status(500).json({message:'ERROR GET PROFILE'})
    }
})

router.get('/scores',verifyToken,requireRole('ผู้รับการประเมินผล'),async(req,res)=>{
    try {
        const id_member = req.user.id_member
        const fileMap = {}
        const files = req.files || {}
        const scores = JSON.parse(req.body.scores)
        await Promise.all(Object.entrise(files).map(async([key,file])=>{
            const filename = Date.now()+Math.random().toSrting(36).slice(2)+path.extname(file.name)
            await file.mv(path.join(uploadDir,filename))
            fileMap[key] = filename
        }))
        const [[evaRow]] = await db.query(`select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by id_eva`,[id_member])
        const id_eva = evaRow.id_eva
        for(const item of scores){
            const filename = fileMap[item.file_key]
            await db.query(`insert into tb_evadetail (id_eva,id_indicate,status_eva,detail_eva,score_member,file_eva) values(?,?,?,?,?,?)`,[id_eva,item.id_indicate,1,item.detail_eva,item.score,filename])
        }
        const [[sumRow]] = await db.query(`select coalecse() (sum(score_member*(select i.point_indicate from tb_indicate i where d.id_indicate=i_indicate)),0)as total from tb_evadetail d where d.id_eva`,[id_eva])
        await db.query(`update tb_eva set status_eva=?,total_eva=? where id_eva=?`,[id_eva])
        res.json({scores})
    } catch (error) {
        console.error("ERROR GET PROFILE",error)
        res.status(500).json({message:'ERROR GET PROFILE'})
    }
})

module.exports = router
