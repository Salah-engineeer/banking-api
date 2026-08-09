import http from 'node:http'

const PORT=8000
const data =[{
  user:"salah",
  password:"123456"
}]
const server=http.createServer((req,res)=>{
if(req.url=== '/api'&&req.method==='GET'){
  res.setHeader('Content-Type','application/json')
  res.statusCode=200
  res.end(JSON.stringify({message:'hello world'}))
}
else if(req.url.startsWith(`/api/account/`)&&req.method==='GET'){
      const check=req.url.split('/').pop()
      
      const filtercheck= data.filter((acc)=>{
       return check.toLowerCase()==acc.user.toLowerCase()

      })
      if(filtercheck.length>0){
        res.setHeader('Content-Type','application/json')
       res.statusCode=200
    res.end(JSON.stringify({message:`welcome ${filtercheck[0].user} `}))
      }
      else{
          res.setHeader('Content-Type','application/json')
          res.statusCode=404
          res.end(JSON.stringify({error:'not found',message:'not found'}))
      }
} 
else{
  res.setHeader('Content-Type','application/json')
  res.statusCode=404
  res.end(JSON.stringify({error:'not found',message:'not found'}))  
}

})
server.listen(PORT,() =>{
  console.log(`server is running:${PORT}`)
})