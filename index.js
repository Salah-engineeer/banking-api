import http from 'node:http'
import {call} from './functions.js'

const PORT=8000
const data =[{
  user:"salah",
  password:"123456"
}]
 export const server=http.createServer((req,res)=>{
if(req.url=== '/api'&&req.method==='GET'){
  call(res,200,{message:'hello world'})
}
else if(req.url.startsWith(`/api/account/`)&&req.method==='GET'){
      const check=req.url.split('/').pop()
      
      const filtercheck= data.filter((acc)=>{
       return check.toLowerCase()==acc.user.toLowerCase()

      })
      if(filtercheck.length>0){
        call(res,200,{message:`welcome ${filtercheck[0].user} `})
      }
      else{
        call(res,404,{error:'not found',message:'not found'})
      }
} 
else{
  call(res,404,{error:'not found',message:'not found'})
}

})
server.listen(PORT,() =>{
  console.log(`server is running:${PORT}`)
})