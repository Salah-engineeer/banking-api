import sanitizeHtml from 'sanitize-html'
import path from 'path'
import fs from 'fs/promises'
export function call(res,statusCode,message){
  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Access-Control-Allow-Methods','GET')
  res.setHeader('Content-Type','application/json')
       res.statusCode=statusCode
    res.end(JSON.stringify(message))
}
export function callfront(res,statusCode,contenttype,filepath){
 res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Access-Control-Allow-Methods','GET')
  res.setHeader('Content-Type',contenttype)
       res.statusCode=statusCode
     res.end(filepath)

}
export function querychecker(data,urlquery){
  const filterdata=data.filter((item)=>{
    if(urlquery.hasOwnProperty('user') &&
  item.user!==urlquery.user){
    return false
  }
  if(urlquery.hasOwnProperty('country') &&
  item.country!==urlquery.country.toLowerCase()){
    return false
  }
  return true
})
return filterdata.map((item)=>{
  return {
    user:item.user,
    transcation:item.transcation,
    country:item.country
  }
})
}

export function getcontnenttypes(ext){
const types = {
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml"
}

return types[ext.toLowerCase()] || "text/html"
}
export async function parseBody(req){
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
try{

  return JSON.parse(body);
}
catch(err){
  throw new Error(`Invalid JSON ${err.message}`);
}
 
}
export async function getData(){
  try{
  const dirname=import.meta.dirname
  const pathtodata=path.join(dirname,'data.json')
  const data =await fs.readFile(pathtodata,'utf-8')
  return JSON.parse(data)
}
catch(err){
  console.log(err)
  return [];
}
}

export async function sanitizeData(data){
 const sanitize={}
 for(const[key,value] of Object.entries(data)){
  if(typeof value==='string'){
    sanitize[key]=sanitizeHtml(value,{
      allowedTags:[],
      allowedAttributes:{}
    })
  }
  else{
    sanitize[key]=value
  }
}
return sanitize
}

export async function HandlePost(res,req){
  try{
  const clientdata=await parseBody(req)
  const validation=validateAccount(clientdata)
  if(!validation.valid){
     return call(res,400,{error:'Invalid Data',message:validation.message})

  }
  else{
    clientdata.country=clientdata.country.trim().toLowerCase()
  const sanitizedData=await sanitizeData(clientdata)
  const data =await getData()
  data.push(sanitizedData)
   await fs.writeFile(path.join(import.meta.dirname,'data.json'),JSON.stringify(data,null,2),'utf-8')
   call(res,201,{message:'data added successfully'})
}
  }
catch(err){
console.log(err)
call(res,500,{error:'Internal Server Error',message:err.message}) 
}
}
export function validateAccount(data){
   const allowedCountries=['egypt','turkey','germany','usa']
  if(typeof data!=='object'||data===null||Array.isArray(data)){
    return {valid:false,message:'data should be a non-null object'}
  }
  if(typeof data.user!=='string'||data.user.trim()===''){
    return {valid:false,message:'user is required and should be a non-empty string'}
  }
  const usernameRegex=/^[a-zA-Z0-9_]+$/
  if(!usernameRegex.test(data.user)){
    return {valid:false,message:'user should only contain alphanumeric characters and underscores'}
  }
  if(typeof data.transcation!=='string'){
    return {valid:false,message:'transcation should be a string'}
  }
  const transcationRegex=/^[1-9][0-9]*\$$/
  if(!transcationRegex.test(data.transcation)){
    return {valid:false,message:"incoorect number format"}
  }

  if(typeof data.country!=='string'||data.country.trim()===''){
    return {valid:false,message:'country is required and should be a non-empty string'}
  }
if(!allowedCountries.includes(data.country.trim().toLowerCase())){
  return {valid:false,message:'country is not in the allowed list'}
}
if(typeof data.password!=='string'||data.password.trim()===''){
  return {valid:false,message:'password is required and should be a non-empty string'}
}
const passwordRegex = /^[A-Za-z0-9!@#$%^&*_-]{8,64}$/
if(!passwordRegex.test(data.password)){
return {valid:false,message:'password should be at least 8 characters long and contain only alphanumeric characters and special characters !@#$%^&*_-'}
}
  return {valid:true,message:'data is valid'}
}
