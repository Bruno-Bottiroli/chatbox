export const checkId= (req, res, next)=>{
    const {  id  } = req.params

    if(isNaN(id)){
      return res.send("debe ingresar un numero")
    }

    next()
}