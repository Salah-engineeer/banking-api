export function call(res,statusCode,message){
  res.setHeader('Content-Type','application/json')
       res.statusCode=statusCode
    res.end(JSON.stringify(message))
}