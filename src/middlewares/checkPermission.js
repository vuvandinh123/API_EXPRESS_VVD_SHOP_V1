const checkPermission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permission){
            return res.status(403).send({
                code: 403,
                message: "Forbidden Error",
            })
        }
        if(req.objKey.permission === permission){
            return next()
        }
        return res.status(403).send({
            code: 403,
            message: "Forbidden Error",
        })
        
    }
}
module.exports = checkPermission