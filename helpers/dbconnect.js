require('mongoose')
.connect('mongodb://localhost/relation2705',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(()=>console.log('DB connected!'))
.catch(err=>console.log(err.message))
