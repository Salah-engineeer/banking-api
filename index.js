import http from 'node:http'
import {call} from './functions.js'
import {querychecker} from './functions.js'
import {getcontnenttypes} from './functions.js'
import {callfront} from './functions.js'
import fs from 'node:fs/promises'
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

 export const server=http.createServer(async (req,res)=>{
  const urlobj=new URL(req.url,`http://${req.headers.host}`)
  const urlquery=Object.fromEntries(urlobj.searchParams)

 
  if(urlobj.pathname=== '/api'&&req.method==='GET'&&(urlquery.hasOwnProperty('user') || urlquery.hasOwnProperty('country'))){
  let  filterdataparm=querychecker(data,urlquery)
  call(res,200,filterdataparm)
}
else if(req.url.startsWith(`/api/account/`)&&req.method==='GET'){
      const check=urlobj.pathname.split('/').pop()
      
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
    const pathtofront=path.join(dirname,'frontend')
 const filepath=path.join(pathtofront,urlobj.pathname==='/'?'index.html':urlobj.pathname)
 
  const ext=path.extname(filepath)
 const contenttype=getcontnenttypes(ext)
 try{
  const read=await fs.readFile(filepath)
  callfront(res,200,contenttype,read)
 }
    catch(err){
      console.log(err)
      if(err.code==='ENOENT'){
        callfront(res,404,'text/html',await fs.readFile(path.join(pathtofront,'404.html')))
      }
      else{
        callfront(res,500,'text/html', `<html><h1>Server Error: ${err.code}</h1></html>`)
      }

}
}
})
server.listen(PORT,() =>{
  console.log(`server is running:${PORT}`)
})

