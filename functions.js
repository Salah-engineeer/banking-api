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
  item.country!==urlquery.country){
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