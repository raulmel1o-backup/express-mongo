const auth = (req, res, next) => {
    
    console.log(req.session);

    if(!req.session.user) {
    
        const err = new Error('You are not authenticated!');
        err.status = 403;
      
        return next(err);
  
    } else {
    
        if (req.session.user === 'authenticated') {
    
            next();
    
        } else {
      
            const err = new Error('You are not authenticated!');
            err.status = 403;
      
            return next(err);
    
        }
  
    }

}

module.exports = auth;