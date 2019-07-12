require('mongoose')
.connect('mongodb://localhost/server2705',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(()=>console.log('DB connected!'))
.catch(err=>console.log(err.message))