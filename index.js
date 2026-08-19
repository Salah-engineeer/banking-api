import http from 'node:http'
import {call} from './functions.js'
import {querychecker} from './functions.js'
import path from 'node:path'
const PORT=8000
const data =[{
  user:"salah",
  password:"123456",
   transcation: '200$',
  country:'turkish'
}
,
{
  user:"ahmed",
  password:"123",
  transcation: '200$',
  country:'egypt'
}]
const dirname=import.meta.dirname
const pathtodata=path.join(dirname,'data.js')//created a path to data.json file how to acces it i still ddidnt do it

 export const server=http.createServer((req,res)=>{
  const urlobj=new URL(req.url,`http://${req.headers.host}`)
  const urlquery=Object.fromEntries(urlobj.searchParams)
if(urlobj.pathname=== '/api'&&req.method==='GET'&&urlobj.search!=''&&(urlquery.hasOwnProperty('user') || urlquery.hasOwnProperty('country'))){
  let  filterdataparm=querychecker(data,urlquery)
  call(res,200,filterdataparm)
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

