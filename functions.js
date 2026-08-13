export function call(res,statusCode,message){
  res.setHeader('Content-Type','application/json')
       res.statusCode=statusCode
    res.end(JSON.stringify(message))
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
return filterdata
}