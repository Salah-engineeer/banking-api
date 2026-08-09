import http from 'node:http'

const PORT=8000

const server=http.createServer((req,res)=>{
if(req.url=== \'/api'&&req.method==='GET'){
  res.setHeader('Content-Type','application/json')
  res.statusCode=200
  res.end(JSON.stringify({message:'hello world'}))
}else{
  res.setHeader('Content-Type','application/json')
  res.statusCode=404
  res.end(JSON.stringify({error:'not found',message:'not found'}))  
}

})
server.listen(PORT,() =>{
  console.log(`server is running:${PORT}`)
})